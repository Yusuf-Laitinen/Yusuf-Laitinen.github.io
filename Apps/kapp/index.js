async function display_tasks(task_index_data){
    var tasks = Object.keys(task_index_data[0])

    for (let i = 0; i < tasks.length; i++) {
        let b = document.createElement("button")

        b.innerText = tasks[i]
        b.onclick = () => {
            selectTask(task_index_data, tasks[i])
        }

        document.getElementById("task_list").append(b)
    }
}

async function selectTask(task_index_data, task) {
    let i = document.createElement("iframe")
    i.src = task_index_data[0][task]
    i.id = "iframe"
    document.body.append(i)

    let b = document.createElement("button")
    b.id = "deleteIframe"
    b.innerText = "Back"
    b.onclick = () => {
        document.getElementById("iframe").remove()
        document.getElementById("deleteIframe").remove()
    }
    document.body.append(b)
}

window.onload = async function() {
    var task_index_data
    await fetch("tasks/index.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            task_index_data = data
        })
    
    await display_tasks(task_index_data)

} 