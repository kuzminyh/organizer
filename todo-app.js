(function () {
    let todoLocalStorageList = [];
    let todoItems = [];
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }
    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button')
        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';
        button.disabled = true;
        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button,
        };
    }
    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group')
        return list
    }
    function createTodoItem(name) {
        let item = document.createElement('li');
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = name;
        item.dataset.name = name;
        buttonGroup.classList.add('btn-group', 'btn-group-sm')
        doneButton.classList.add('btn', 'btn-success')
        doneButton.textContent = 'Готово'
        deleteButton.classList.add('btn', 'btn-danger')
        deleteButton.textContent = 'Удалить'
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup)
        return {
            item,
            doneButton,
            deleteButton
        }
    }


    function createTodoItemsFromLocalStorage(whoseTodo, todoListObject, todoList) {
        todoItems = JSON.parse(localStorage.getItem(whoseTodo)) === null ? [] : JSON.parse(localStorage.getItem(whoseTodo));

        console.log('todoItems', todoItems)
        let j = 0;
        for (let i = 0; i < todoItems.length; i++) {
         let todoItem = createTodoItem(todoItems[i].name)
            if (todoItems[i].done) {
                todoItem.item.classList.add('list-group-item-success')
            }
            todoItem.deleteButton.addEventListener('click', function () {
                if (confirm('Вы уверены')) {
                    let index = todoItems.findIndex(item1 => item1.name === todoItem.item.dataset.name);
                    // console.log('index',index )
                    console.log('todoItems',todoItems )
                    todoItems.splice(index,1);
                    console.log('todoItem.item', todoItem.item.dataset.name)
                    console.log('todoItems',todoItems )
                    todoItem.item.remove();
                }
            })
            todoItem.doneButton.addEventListener('click', function () {
                todoItem.item.classList.toggle('list-group-item-success');
                let elem = todoItems.find(item1 => item1.name === todoItem.item.dataset.name);
                elem.done = !elem.done;
            })
            j = i;
            todoList.append(todoItem.item)
        }
        console.log('j', j);

        for (let i = 0; i < todoListObject.length; i++) {
            todoItems.push(todoListObject[i]);
           let todoItem = createTodoItem(todoListObject[i].name);
            if (todoListObject[i].done) {
                todoItem.item.classList.add('list-group-item-success')
            }
            todoItem.doneButton.addEventListener('click', function () {
                todoItem.item.classList.toggle('list-group-item-success');
                let elem = todoItems.find(item1 => item1.name === todoItem.item.dataset.name);
                elem.done = !elem.done;     
            })
            todoItem.deleteButton.addEventListener('click', function () {
                if (confirm('Вы уверены')) {
                    let index = todoItems.findIndex(item1 => item1.name === todoItem.item.dataset.name);
                    todoItems.splice(index,1);
                    todoItem.item.remove();
                }
            })
            todoList.append(todoItem.item)
        }
    }

    function createTodoApp(container, title = 'Список дел', todoListObject = [], whoseTodo) {

        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();
        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);
        createTodoItemsFromLocalStorage(whoseTodo, todoListObject, todoList);

        todoItemForm.input.addEventListener('input', function () {
            if (!todoItemForm.input.value) {
                todoItemForm.button.disabled = true;
            }
            else {
                todoItemForm.button.disabled = false;
            }
        })
        todoItemForm.form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!todoItemForm.input.value) {
                return
            }
            let todoItem = createTodoItem(todoItemForm.input.value)
            todoItem.doneButton.addEventListener('click', function () {
                todoItem.item.classList.toggle('list-group-item-success');
                let elem = todoItems.find(item1 => item1.name === todoItem.item.dataset.name);
                console.log('elem',elem)
                elem.done = !elem.done; 
                console.log('todoItems',todoItems)
            })
            todoItem.deleteButton.addEventListener('click', function () {
                if (confirm('Вы уверены')) {
                    let index = todoItems.findIndex(item1 => item1.name === todoItem.item.dataset.name);
                    todoItems.splice(index,1);
                    todoItem.item.remove();
               }
            })
            todoList.append(todoItem.item);
            todoItemForm.button.disabled = true;

            let todoLocalStorageItem = {}
            todoLocalStorageItem.name = todoItemForm.input.value;
            todoItemForm.input.value = '';

            let a = todoItem.item.classList.contains('list-group-item-success');
            if (a) {
                todoLocalStorageItem.done = true;
            }
            else {
                todoLocalStorageItem.done = false;
            }

            todoItems.push(todoLocalStorageItem);
            localStorage.setItem(whoseTodo, JSON.stringify(todoItems));
        })
    }
    window.createTodoApp = createTodoApp;
})();
