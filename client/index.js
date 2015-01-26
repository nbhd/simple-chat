(function () {
    var socketio = io.connect('http://127.0.0.1:3000');

    var msgArea = document.getElementById("msg");
    var myName;

    socketio.on("connected", function(name) {});
    socketio.on("publish", function (data) {
      addMessage(data.value);
    });
    socketio.on("disconnect", function () {});

    function start(name) {
        socketio.emit("connected", name);
    }

    function addMessage (msg) {

        React.render(
            <Comment  msg={msg} />,
            document.getElementById('msg')
        );
    }

    var InputName = React.createClass({
        submit: function (e) {
            e.preventDefault();

            var input = document.getElementById('name_input');
            var name = input.value + Math.floor(Math.random() * 100);
            myName = name;
            addMessage('you are ' + name);
            start(name);

            React.render(
                <InputMessage />,
                document.getElementById('input-area')
            );
        },
        render: function () {
            return (
                <form onSubmit={this.submit}>
                    <div id='name-area' className="input-append">
                        <label>user name</label>
                        <input className="span5" type="text" id="name_input" placeholder='input your name'/>
                        <button className="btn btn-primary">join</button>
                    </div>
                </form>
            );
        }
    });

    var InputMessage = React.createClass({
        submit: function (e) {
            e.preventDefault();

            var textInput = document.getElementById('msg_input');
            var msg = "[" + myName + "]: " + textInput.value;
            socketio.emit("publish", {value: msg});
            textInput.value = '';

        },
        render: function () {
            return (
                <form onSubmit={this.submit}>
                    <div id='message-area' className="input-append">
                        <label>message</label>
                        <input className="span5" type="text" id="msg_input"/>
                        <button className="btn btn-primary">send</button>
                    </div>
                </form>
            );
        }
    });

    var Comment = React.createClass({

        getInitialState: function () {
            return {comments: []};
        },

        render: function () {
            var msg = new Date().toLocaleTimeString() + ' ' + this.props.msg;
            var comments = this.state.comments || [];
            comments.push(msg);

            // this.setState({comments: comments});

            var nodes = this.state.comments.map(function (comment, index) {
                return (
                    <div>
                        {comment}
                    </div>
                );
            });

            return (
                <div>
                    {nodes}
                </div>
            );
        }
    });

    React.render(
        <InputName />,
        document.getElementById('input-area')
    );

}());
