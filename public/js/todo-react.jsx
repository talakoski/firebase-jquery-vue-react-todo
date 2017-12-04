const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var TodoList = React.createClass({
  render: function() {
    var _this = this;
    var createItem = function(item, index) {
      return (
        <li key={item['.key']} className="mdl-list__item">
          <span className="mdl-list__item-primary-content">
          <i className="material-icons mdl-list__item-icon"> check_circle </i>
            { item.todo }
          </span>
          <a href="#" className="mdl-list__item-secondary-action delete-todo" onClick={ _this.props.removeItem.bind(null, item['.key']) }>
            <i className="material-icons">delete_forever</i>
          </a>
        </li>
      );
    };
    return (
      <ul>
        <ReactCSSTransitionGroup
          transitionName="todo-list">

          { this.props.items.map(createItem) }
        </ReactCSSTransitionGroup>
      </ul>
    );
  }
});

var TodoApp = React.createClass({
  getInitialState: function() {
    return {
      items: [],
      text: ''
    };
  },

  componentWillMount: function() {
   this.firebaseRef = firebase.database().ref('todos');

   this.firebaseRef.on('value', function(dataSnapshot) {
     var items = [];
     dataSnapshot.forEach(function(childSnapshot) {
       var item = childSnapshot.val();
       item['.key'] = childSnapshot.key;
       items.push(item);
     });

     this.setState({
       items: items
     });
   }.bind(this));
  },


  componentWillUnmount: function() {
    this.firebaseRef.off();
  },

  onChange: function(e) {
    this.setState({text: e.target.value});
  },

  removeItem: function(key) {
    var firebaseRef = firebase.database().ref('todos');;
    firebaseRef.child(key).remove();
  },

  handleSubmit: function(e) {
    e.preventDefault();
    if (this.state.text && this.state.text.trim().length !== 0) {
      this.firebaseRef.push({
        todo: this.state.text
      });
      this.setState({
        text: ''
      });
    }
  },

  // Material design needs this:
  componentDidUpdate: function() {
    // This upgrades all upgradable components (i.e. with 'mdl-js-*' class)
    componentHandler.upgradeDom();
  },


  render: function() {
    return (
      <div>
        <TodoList items={ this.state.items } removeItem={ this.removeItem } />

        <form id="form" onSubmit={ this.handleSubmit } >
          <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input className="mdl-textfield__input" type="text" onChange={ this.onChange } value={ this.state.text } />
            <label className="mdl-textfield__label">To do...</label>
            <span id="error" className="mdl-textfield__error">Error happened</span>
          </div>
          <br/>
          <button type="submit" className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">
            Add
          </button>
        </form>

      </div>
    );
  }
});

ReactDOM.render( <TodoApp /> , document.getElementById('react-app'));
