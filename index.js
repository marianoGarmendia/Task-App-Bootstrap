
let itemStorage = [];
let edit = false;

document.body.style.backgroundColor = "#ff4a38"

class Tasks {
    constructor(task , description){
        this.task = task;
        this.description = description; 
    }
    
}

class UI {
    addTask(item){
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("card", "mt-2")
        const taskContainer = document.getElementById("task__container");
        taskDiv.innerHTML = `
            <div class="card-body shadow">
                <h5 class="card-title">${item.task}</h5>
                <p class="card-text">${item.description}</p>
                <button type="button" class="btn btn-dark" data-task="${item.task}" data-description="${item.description}" id="edit">Edit</button>
                <button type="button" class="btn btn-danger" data-id="${item.task}" id="delete">Delete</button>
            </div>
        `
        taskContainer.appendChild(taskDiv)

        document.getElementById("btn__form").value = "Save"

        itemStorage.push(item)
        // console.log(itemStorage)
        this.addStorage()
        this.resetForm();
    }

    resetForm(){
        document.getElementById("form__tasks").reset();
    }

    addStorage(){
        
       localStorage.setItem("task" , JSON.stringify(itemStorage))
    }

    deleteTask(taskDelete){
        if(taskDelete.id === "delete"){
            taskDelete.parentElement.parentElement.remove();
            this.deleteTaskStorage(taskDelete)
            this.showMessage("Task deleted succesfuly!", "success")
        }
    }

    // Edita la tarea, contruye una card nueva, la reemplaza por la anterior,  reemplaza el boton upload
    

    editTask(item){
        let card = item.parentElement.parentElement.parentElement;
        let replaceCard = item.parentElement.parentElement;
        replaceCard.style.backgroundColor = "#bdb8b8"
        // console.log(card)
        
        if(item.id === "edit"){
           document.getElementById("task__name").value = item.dataset.task;
           document.getElementById("task__description").value = item.dataset.description;

           const btnForm = document.getElementById("btn__form");
           btnForm.setAttribute("disabled","")

           let btnUpload = document.createElement("div");
           btnUpload.innerHTML = `
                <button
                    type="button"
                    class="btn btn-info btn-block"
                    id="upload"
                >Upload</button>
           `
            const parentBtn = btnForm.parentElement;
            
            parentBtn.replaceChild(btnUpload , btnForm )

            btnUpload.addEventListener("click" , () => {

                const taskName = document.getElementById("task__name").value;
                const taskDescription = document.getElementById("task__description").value;
                const task = new Tasks(taskName , taskDescription);

                const taskDiv = document.createElement("div");
                taskDiv.classList.add("card", "mt-2")
                const taskContainer = document.getElementById("task__container");
                taskDiv.innerHTML = `
                    <div class="card-body shadow">
                        <h5 class="card-title">${taskName}</h5>
                        <p class="card-text">${taskDescription}</p>
                        <button type="button" class="btn btn-dark" data-task="${taskName}" data-description="${taskDescription}" id="edit">Edit</button>
                        <button type="button" class="btn btn-danger" data-id="${taskName}" id="delete">Delete</button>
                    </div>
                `
                card.replaceChild( taskDiv , replaceCard )

                for(let i=0 ; i<itemStorage.length ; i++){
                    if( item.dataset.task === itemStorage[i].task ){
                        edit= true
                        this.deleteTaskStorage(item , task)

                        parentBtn.replaceChild(btnForm , btnUpload )
                        btnForm.removeAttribute("disabled")
                        this.resetForm();
                        this.showMessage("task edited succesfully", "info")
                        
                        
                    }
                }

            })

          
        }
    }

    deleteTaskStorage(item , task){
        // console.log(item.dataset.id)
        if(edit){

            for( let i=0 ; i<itemStorage.length ; i++){
                if( item.dataset.task === itemStorage[i].task ){
                    itemStorage.splice([i],1, task)
                    localStorage.clear()
                    this.addStorage();
                    return edit=false;
                }
           }

        }else{
            for( let i=0 ; i<itemStorage.length ; i++){
                if( item.dataset.id || item.dataset.task === itemStorage[i].task ){
                    itemStorage.splice([i],1)
                    localStorage.clear()
                    this.addStorage();
                }
           }

        }

       
    }

    // Mensajes que se muestran al terminar una accion

    showMessage(msg , cssClass){
        const container = document.querySelector(".container");
        const messageContainer = document.createElement("div");
        // messageContainer.className = "alert alert-succes"
        const row = document.querySelector(".row");
        messageContainer.innerHTML = ` 
            <div class="alert alert-${cssClass}">
                ${msg}
            </div>
        `
        container.insertBefore(messageContainer, row )

        setTimeout(() => {
            document.querySelector(".alert").remove()
        }, 2000)
    }
}


// eventos del dom 



// Agregando tarea **************
const formTask = document.getElementById("form__tasks");

formTask.addEventListener("submit", (e) => {
    e.preventDefault()
    let btnForm = document.getElementById("btn__form"); 
    if( btnForm.value === "Save"){
        const taskName = document.getElementById("task__name").value;
        const taskDescription = document.getElementById("task__description").value;
        const task = new Tasks(taskName , taskDescription);
            
        const ui = new UI();
        ui.addTask(task)
        ui.showMessage("Task create succesfuly" , "success");
    }
         
   
})

window.onload = () =>{
    const ui = new UI();
     taskStorage = JSON.parse( localStorage.getItem("task"))
    
     if(taskStorage !== null){
        for( item of taskStorage){
            ui.addTask(item)
        }

       
    
}

// Eliminar tareas 
document.getElementById("task__container").addEventListener("click", (e) => {
    const ui = new UI();
    ui.deleteTask(e.target)
})

// Editar treas
document.getElementById("task__container").addEventListener("click", (e) => {
    const ui = new UI();
    ui.editTask(e.target)
})

}