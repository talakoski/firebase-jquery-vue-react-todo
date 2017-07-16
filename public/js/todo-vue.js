document.addEventListener("DOMContentLoaded", function() {

  var todosRef = firebase.database().ref('todos');

  // create Vue app
  var app = new Vue({
    // element to mount to
    el: '#app',
    // initial data
    data: {
      newTodo: {
        todo: ''
      }
    },
    // firebase binding
    // https://github.com/vuejs/vuefire
    firebase: {
      todos: todosRef
    },
    // methods
    methods: {
      addTodo: function() {
        todosRef.push(this.newTodo);
        this.newTodo.todo = '';
      },
      removeTodo: function(todo) {
        todosRef.child(todo['.key']).remove();
      }
    }
  });

});
