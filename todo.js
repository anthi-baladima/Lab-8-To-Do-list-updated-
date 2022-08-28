fetch('http://localhost:3000/read').then(response => response.text()).then(data => {
    if (data !== ""){
        dataArray = data.split("\n");
        dataArray.forEach(item => {
            const a = document.createElement("li");
            a.textContent = item;
            todoList.appendChild(a);
            a.addEventListener("dblclick", function() {
                pos = 0;
                current = a;
                while (current.previousElementSibling) {
                    pos = pos + 1;
                    current = current.previousElementSibling;
                }
                todoList.removeChild(a);

                fetch('http://localhost:3000/delete', {
                    method: 'POST',
                    body: pos, 
                    headers: {
                        'Content-type': 'text' // The type of data you're sending
                    }
                });
            });
        });
    }
});

//btnClear points to the #clear-button element in the DOM
const btnClear = document.querySelector('#clear-button');

//Adding and event listener: btnClear will react on the click event
//When the btnClear is clicked, then the callback fuction 
//(the 2nd argument of the event listener) will be called. 


const newItem= document.querySelector("#new-item");
const todoList=document.querySelector('#todo-list');

//Κανένα από αυτά δεν θα χρειαστεί redeclare ή update, άρα η const ταιριάζει

newItem.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        const a = document.createElement('li');
        a.textContent = newItem.value;
        // a.addEventListener("click", function() {
        //     a.classList.toggle('completed');
        // });
        a.addEventListener("dblclick", function() {
            pos = 0;
            current = a;
            while (current.previousElementSibling) {
                pos = pos + 1;
                current = current.previousElementSibling;
            }
            todoList.removeChild(a);
            
            fetch('http://localhost:3000/delete', {
                method: 'POST',
                body: pos, 
                headers: {
                    'Content-type': 'text' // The type of data you're sending
                }
            });
        });
        todoList.appendChild(a);
        fetch('http://localhost:3000/add', {
            method: 'POST',
            body: newItem.value, 
            headers: {
                'Content-type': 'text' // The type of data you're sending
            }
        });
    }
});

btnClear.style.display = "none"
// btnClear.addEventListener("click", function() {
//     todoList.innerHTML='';
// });
