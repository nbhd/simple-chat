(function () {

    // つなぎ先
    var socketio = io.connect('http://127.0.0.1:3000');

    var myName;

    // socketio event
    socketio.on("connected", function(name) {});
    socketio.on("publish", function (data) {
        addMessage(data.value);
    });
    socketio.on("disconnect", function () {});

    function addMessage (msg) {

        React.render(
            <Message  msg={msg} />,
            document.getElementById('msg')
        );
    }

    /**
     * 名前入力
     */
    var InputName = React.createClass({

        /**
         * 送信
         */
        submit: function (e) {
            e.preventDefault();

            var input = document.getElementById('name_input');
            var name = input.value + Math.floor(Math.random() * 100);
            myName = name;
            addMessage('you are ' + name);

            socketio.emit("connected", name);

            React.render(
                <InputMessage />,
                document.getElementById('input-area')
            );
        },

        /**
         * 描画
         */
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

    /**
     * メッセージ入力
     */
    var InputMessage = React.createClass({

        /**
         * 送信
         */
        submit: function (e) {
            e.preventDefault();

            var textInput = document.getElementById('msg_input');
            var msg = "[" + myName + "]: " + textInput.value;
            socketio.emit("publish", {value: msg});
            textInput.value = '';

        },

        /**
         * 描画
         */
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

    /**
     * メッセージ一覧
     */
    var Message = React.createClass({

        /**
         *
         */
        getInitialState: function () {
            return {messages: []};
        },

        /**
         *
         */
        render: function () {
            var msg = new Date().toLocaleTimeString() + ' ' + this.props.msg;
            var messages = this.state.messages || [];
            messages.push(msg);

            var nodes = this.state.messages.map(function (message, index) {
                return (
                    <div>
                        {message}
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
