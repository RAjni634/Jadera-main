


// Chatbox Class Definition
class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        };

        this.state = false;
        this.messages = [];
    }

    display() {
        const { openButton, chatBox, sendButton } = this.args;

        if (!openButton || !chatBox || !sendButton) {
            console.error('Required elements are missing in the DOM.');
            return;
        }

        openButton.addEventListener('click', () => this.toggleState(chatBox));
        sendButton.addEventListener('click', () => this.onSendButton(chatBox));

        const node = chatBox.querySelector('input');
        if (node) {
            node.addEventListener("keyup", ({ key }) => {
                if (key === "Enter") {
                    this.onSendButton(chatBox);
                }
            });
        }
    }

    toggleState(chatbox) {
        this.state = !this.state;

        // Show or hide the box
        if (this.state) {
            chatbox.classList.add('chatbox--active');
            // Hide notification once the chatbox is opened
            const notification = document.getElementById('notification');
            if (notification) {
                notification.style.display = 'none';
            }
        } else {
            chatbox.classList.remove('chatbox--active');
        }
    }

    onSendButton(chatbox) {
        const textField = chatbox.querySelector('input');
        let text1 = textField.value;
        if (text1 === "") {
            return;
        }

        let msg1 = { name: "User", message: text1 };
        this.messages.push(msg1);

        // Simulate AI response with a random delay (between 1-3 seconds)
        const randomDelay = Math.floor(Math.random() * 3000) + 1000; // Random delay between 1s and 3s

        fetch('/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(r => r.json())
        .then(r => {
            let msg2 = { name: "Jadera", message: r.answer };
            this.messages.push(msg2);
            this.updateChatText(chatbox);
            textField.value = '';
        })
        .catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox);
            textField.value = '';
        });
    }

    updateChatText(chatbox) {
        let html = '';
        this.messages.slice().reverse().forEach(item => {
            if (item.name === "Jadera") {
                html += `<div class="messages__item messages__item--visitor">${item.message}</div>`;
            } else {
                html += `<div class="messages__item messages__item--operator">${item.message}</div>`;
            }
        });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        if (chatmessage) {
            chatmessage.innerHTML = html;
        }
    }
}

// Initialize Chatbox and handle chat saving
document.addEventListener('DOMContentLoaded', () => {
    const chatbox = new Chatbox();
    chatbox.display();

    let userInactiveTimer;

    function startInactiveTimer() {
        // Clear the previous timer, if any
        clearTimeout(userInactiveTimer);

        // Set a timer for 2 seconds of inactivity
        userInactiveTimer = setTimeout(() => {
            askForEmailAndSendChat();
        }, 2000); // 2 seconds
    }

    // Monitor user input and reset timer on any message
    const userInput = document.getElementById('userInput');

    // Check if userInput element exists
    if (userInput) {
        userInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter' && userInput.value.trim() !== '') {
                sendMessage();
                startInactiveTimer();
            }
        });
    }

    // Function to ask for customer's email and send the chat
    function askForEmailAndSendChat() {
        const customerEmail = prompt("Would you like to save the chat transcript? Enter your email to receive it:");
        if (customerEmail) {
            saveChatAsPdfAndSend(customerEmail);
        }
    }

    function saveChatAsPdfAndSend(email) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Get the chat messages text
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) {
            console.error('Chat messages element not found.');
            return;
        }
        const messages = chatMessages.innerText;

        // Add chat content to the PDF
        doc.text(messages, 10, 10);

        // Convert PDF to Blob
        const pdfBlob = doc.output('blob');

        // Create a FormData object to send the PDF and email
        const formData = new FormData();
        formData.append('pdf', pdfBlob, 'chat.pdf');
        formData.append('email', email);

        // Send the PDF and email to the server
        fetch('/send-email', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Chat PDF sent to your email successfully!");
            } else {
                alert("Failed to send email.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("An error occurred while sending the email.");
        });
    }

    function sendMessage() {
        const userInput = document.getElementById('userInput');
        if (userInput) {
            const userInputValue = userInput.value;
            if (userInputValue.trim() !== '') {
                const chatMessages = document.getElementById('chatMessages');
                if (chatMessages) {
                    // Display user message
                    const userMessage = `
                        <div class="message__item message__item--user">
                            <span>${userInputValue}</span>
                        </div>
                    `;
                    chatMessages.innerHTML += userMessage;

                    // Clear input field
                    userInput.value = '';

                    // Scroll to the latest message
                    chatMessages.scrollTop = chatMessages.scrollHeight;

                    // Simulate AI response
                    const randomDelay = Math.floor(Math.random() * 3000) + 1000; // Adjusted delay range
                    setTimeout(function() {
                        const aiResponse = `
                            <div class="message__item message__item--visitor">
                                <span>Thank you for your question. I'll get back to you shortly.</span>
                            </div>
                        `;
                        chatMessages.innerHTML += aiResponse;
                        chatMessages.scrollTop = chatMessages.scrollHeight;
                    }, randomDelay);
                }
            }
        }
    }
});

//chatbot extra icons starts
document.addEventListener('DOMContentLoaded', () => {
    const optionButtons = document.querySelectorAll('.option-btn');
    const chatMessage = document.querySelector('.chat-message p');
    
    optionButtons.forEach(button => {
        button.addEventListener('click', () => {
            chatMessage.textContent = `You selected: ${button.textContent.trim()}`;
        });
    });
});
//chatbot extra icons ends

//contact-form in chatbot starts

document.addEventListener('DOMContentLoaded', function () {
    const feedbackButton = document.querySelector('.option-btn:nth-child(7)'); // Assuming Feedback is the 7th button
    const chatMessages = document.getElementById('chatMessages');

    feedbackButton.addEventListener('click', function () {
        displayFeedbackForm();
    });

    function displayFeedbackForm() {
        chatMessages.innerHTML = `
                  <div class="feedback-form">
                <h3>Leave Feedback</h3>
                <div class="form-fields">
                    <form id="feedbackForm">
                        <input type="text" id="name" placeholder="Your Name" required>
                        <input type="email" id="email" placeholder="Your Email" required>
                        <textarea id="message" placeholder="Your Feedback" required></textarea>
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>
        `;

        document.getElementById('feedbackForm').addEventListener('submit', handleSubmitFeedback);
    }

    function handleSubmitFeedback(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        fetch('submit_feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, message }),
        })
        
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text); });
            }
            return response.json();
        })
        .then(data => {
            chatMessages.innerHTML = `<p>Thank you for your feedback, ${data.name}!</p>`;
        })
        .catch(error => console.error('Error:', error));
    }
});

//contact-form in chatbot ends

//extra icon in chatbot script starts

    // Function to handle the chat options
    function handleOptionClick(option) {
        const chatMessages = document.getElementById('chatMessages');

        // Customer's message (right-aligned)
        const customerMessageDiv = document.createElement('div');
        customerMessageDiv.classList.add('chat-message', 'customer');
        customerMessageDiv.textContent = option;
        chatMessages.appendChild(customerMessageDiv);

        // Chatbot's response (left-aligned)
        let response = '';

        switch (option) {
            case 'Shipping & Delivery':
                response = 'Our shipping and delivery options include standard and express delivery. Delivery times vary by location.';
                break;
            case 'Returns & Exchanges':
                response = 'You can return or exchange items within 30 days of purchase, as long as the product is in its original condition.';
                break;
            case 'Online Orders or In-Store Purchases':
                response = 'You can order online or visit our stores for purchases. Contact us if you need assistance with an existing order.';
                break;
            case 'Metals & Materials':
                response = 'We use a variety of metals such as gold, silver, and platinum. Our materials are ethically sourced and crafted to perfection.';
                break;
            case 'Size Guide':
                response = 'Our size guide provides detailed measurements for each product to help you find the perfect fit.';
                break;
            case 'Click and Collect':
                response = 'You can reserve items online and pick them up at your nearest store using our Click and Collect service.';
                break;
            case 'Feedback':
                response = 'We value your feedback! Let us know how we can improve our products and services.';
                break;
            case 'Gift Cards':
                response = 'Our gift cards are available in various amounts and can be used both in-store and online.';
                break;
            default:
                response = 'I\'m sorry, I don\'t have a response for that option.';
        }

        const chatbotMessageDiv = document.createElement('div');
        chatbotMessageDiv.classList.add('chat-message', 'chatbot');
        chatbotMessageDiv.textContent = response;
        chatMessages.appendChild(chatbotMessageDiv);

        // Scroll to the bottom of the chat
        chatMessages.scrollBottom = chatMessages.scrollHeight;
    }

//extra icon in chatbot script ends