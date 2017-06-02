
function insertTask(entryId){

    var taskDescControl = $("#TaskDescription");
    var taskListControl = $("#ulTaskList"); 
    var entry = {        
        Type : "Bug",
        Description : taskDescControl.val(),
        TimeEntryId : entryId        
    };

    $.post('/Home/CreateTimeEntry', {entry : entry}, function(data){
        //If post was successfull, clean textbox
        taskDescControl.val(null);

        var taskId = "tsk"+ data.TaskId;

        var newTaskLine = "<li task-item id='"+ taskId +"' class='collection-item scale-transition scale-out'>" +
        "<div class='collection-item-wrapper'>" +
        "<i class='fa fa-terminal'></i> " + data.Description + "" +    
        "<a onclick='deleteTask(this)' class='scale-transition scale-out waves-effect waves-circle btn-floating secondary-content red'><i class='fa fa-trash-o'></i></a>" +
        "</div>" +
        "</li>";     
        
        taskListControl.append(newTaskLine);

        if(!taskListControl.hasClass("scale-in")){
            taskListControl.addClass("scale-in");
        }
        
        var taskControl = $("#" + taskId);
        taskControl.on('mouseenter', function (e) {
            $(this).addClass("popout");
            var btn = $(this).find("a");
            btn.addClass("scale-in pulse");
        });

        taskControl.on('mouseleave', function (e) {
            $(this).removeClass("popout");
            var btn = $(this).find("a");
            btn.removeClass("scale-in");
            btn.removeClass("pulse");
        });

        setTimeout(function() { 
            taskControl.addClass("scale-in");
        }, 500);
    });    

    insertTaskDb(storageId);   

    return false;
}

function deleteTask(control){
    var task = $(control).closest("li");
    var ul = task.closest("ul");
    task.removeClass("scale-in");    

    setTimeout(function() { 
        task.remove();

        if (ul.find("li").length === 0){
            ul.removeClass("scale-in");
        }
    }, 300);
}