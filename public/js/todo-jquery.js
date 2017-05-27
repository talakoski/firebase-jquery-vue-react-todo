var firebaseHelpers = (function() {
  return {
    // Add todo item to database
    addTodoItem: function() {
      var newTodoItemRef = firebase.database().ref().child('todos').push();

      return newTodoItemRef.set({
        todo: $('input[id=todo]').val(),
        created_at: Date(),
      });
    },

    // Get all todos and add then to the list
    // NOTE: not needed since "child_added" event listener adds the items on page load too
    addAllListItems: function() {
      var todosRef = firebase.database().ref('todos');

      todosRef.once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var key = childSnapshot.key;
          var data = childSnapshot.val();

          page.addListItem(key, data.todo);
        });
      });
    },

    // Add firebase listeners for adding and deleting entries
    addListeners: function() {
      var todosRef = firebase.database().ref('todos');

      todosRef.on('child_added', function(data) {
        page.addListItem(data.key, data.val().todo);
      });

      todosRef.on('child_removed', function(data) {
        page.removeListItem(data.key);
      });
    }
  }
})();

var page = (function() {
  return {
    // Add new todo <li> element
    addListItem: function(ref, text) {
      var list = $('#list-todo');

      var html = '<li class="mdl-list__item" data-firebase-ref="' + ref + '"> \
        <span class = "mdl-list__item-primary-content"> \
          <i class = "material-icons mdl-list__item-icon"> check_circle </i> \
      ' + text + ' \
        </span> \
        <a class="mdl-list__item-secondary-action delete-todo" href="#"><i class="material-icons">delete_forever</i></a> \
      </li>';
      list.append(html);
    },

    // Remove <li> element
    removeListItem: function(ref) {
      var li = $('li[data-firebase-ref="' + ref + '"]');

      li.fadeOut(function() {
        li.remove();
      });
    },

    // Add click handler to delete icon
    addDeleteClickHander: function() {
      $('#list-todo').on("click", ".delete-todo", function() {
        ref = $(this).closest("li").data("firebase-ref");
        firebase.database().ref('/todos/' + ref).remove();
      });
    }
  }
})();


$(document).ready(function() {
  var todoForm = $('#form-todo');

  firebaseHelpers.addListeners();
  page.addDeleteClickHander();

  // Saves message on form submit:
  todoForm.submit(function(e) {
    e.preventDefault();
    $("#error").css('visibility', 'hidden');

    firebaseHelpers.addTodoItem()
      .then(function() {
        console.log("new todo item pushed to database");
        todoForm.trigger("reset");
      })
      .catch(function(error) {
        console.log("Error:" + error);
        $("#error").css('visibility', 'visible');
      });
  });

});
