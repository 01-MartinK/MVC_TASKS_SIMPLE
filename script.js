class Model {
    constructor(){

        // data
        this.tasks = [
            {id:1, text: 'korista', complete: false},
            {id:2, text: 'loo', complete: true},
            {id:3, text: 'paranda', complete: false}   
        ]
        
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || []
    } 
    // save changes
    _commit(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks))
      }
    // delete task
    deleteItem(id){
        const prev = this.tasks
        this.clearTasks()

        prev.forEach(item => {
            if (item.id !== id){
                this.addItem(item.text,item.complete)
            }
        })
        
        this._commit(this.tasks)
    } 
    // clear tasks
    clearTasks(){
        this.tasks = []

        this._commit(this.tasks)
    }
    // add task
    addItem(taskText){
        let id = this.tasks.length+1
        this.tasks.push({id: id,text: taskText,complete: false})
        
        this._commit(this.tasks)
    } 
    // get tasks
    getTasks(){
        return this.tasks
    } 
    // toggle todo
    toggleTodo(id){
        this.tasks.forEach(item =>{
            if (item.id === id){
                item.complete = !item.complete
            }
        })

        this._commit(this.tasks)
    }
} 

class View {
    constructor(){
        // basic view
        // root element
        this.app = this.getElement("#root")
        // title
        this.title = this.setElement('h1')
        this.title.textContent = 'Tasks'
        // text field and add button
        this.form = this.setElement('form')

        this.input = this.setElement('input')
        this.input.type = 'text'
        this.input.placeholder = 'Add todo'
        this.input.name = 'todo'
    
        this.submitButton = this.setElement('button')
        this.submitButton.textContent = 'Submit'
        
        this.form.append(this.input, this.submitButton)
        // task list
        this.taskList = this.setElement('ul')
        // append title and taskList
        this.app.append(this.title, this.form, this.taskList)
    } 

    // display tasks
    displayTasks(tasks){
        // check if has items 
        if (tasks.length === 0){
            const p = this.setElement('p')
            p.textContent = 'Pole ülesandeid'
            this.taskList.append(p)
        } else {
            tasks.forEach(task => {
                // create li
                const li = this.setElement('li')
                li.id = task.id
     
                // delete button
                const dBtn = this.setElement('button','delete')
                dBtn.textContent = 'Delete'

                // completion
                const checkbox = this.setElement('input')
                checkbox.type = 'checkbox'
                checkbox.checked = task.complete
                 // strikethrough span
                const span = this.setElement('span')
                // if task complete strike through
                if (task.complete){
                    const strike = this.setElement('s')
                    strike.textContent = task.text
                    span.append(strike)
                } else {
                     span.textContent = task.text
                } 
                // append checkbox and span
                li.append(checkbox,span,dBtn)
                // append created li to task list
                this.taskList.append(li)
             });
        } 
        
    } 

    // clear items list
    clearList() {
        this.taskList.innerHTML = ''
    }

    // get element
    getElement(selector){
        return document.querySelector(selector)
    } 

    // set element
    setElement(tag, className){
        const element = document.createElement(tag)
        if (className !== undefined){
            element.classList.add(className)
        } 
        return element
    } 

    // get input text
    get _todoText() {
        return this.input.value
    }

    // reset input to no text
    _resetInput() {
        this.input.value = ''
    }

    // input binding
    //bind adding
    bindAddTodo(handler) {
        this.form.addEventListener('submit', event => {
            event.preventDefault()
        
            if (this._todoText) {
                handler(this._todoText)
                this._resetInput()
            }
        })
    }

    // bind deleting
    bindDeleteTodo(handler) {
        this.taskList.addEventListener('click', event => {
            if (event.target.className === 'delete') {
                const id = parseInt(event.target.parentElement.id)

                handler(id)
            }
        })
    }

    // bind toggleing
    bindToggleTodo(handler) {
        this.taskList.addEventListener('change', event => {
            if (event.target.type === 'checkbox') {
                const id = parseInt(event.target.parentElement.id)

                handler(id)
            }
        })
    }
} 

class Controller {
    constructor(model, view){

        // model and view declaration
        this.model = model
        this.view = view

        // binding
        this.view.bindAddTodo(this.handleAddTodo)
        this.view.bindDeleteTodo(this.handleDeleteTodo)
        this.view.bindToggleTodo(this.handleToggleTodo)

        // display initial todos
        this.updateTaskList()
    } 

    // update task list
    updateTaskList(){
        this.view.clearList()
        this.view.displayTasks(this.model.getTasks())
    }

    // handle adding tasks
    handleAddTodo = (todoText) => {
        this.model.addItem(todoText)
        this.updateTaskList()
    }

    // handle deleting tasks
    handleDeleteTodo = (id) => {
        this.model.deleteItem(id)
        this.updateTaskList()
    }

    // handle toggleing tasks broken but somewhat works
    handleToggleTodo = (id) => {
        this.model.toggleTodo(id)
        this.updateTaskList()
    }
} 

const app = new Controller(new Model(), new View());