//const data = [
//    { id: 1, author: 'Daniel Lo Nigro', text: 'Hello ReactJS.NET World!' },
//    { id: 2, author: 'Pete Hunt', text: 'This is one comment' },
//    { id: 3, author: 'Jordan Walke', text: 'This is *another* comment' },
//];
class CommentBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: [] };// the only place to assign state directly, otherwise setState()
        this.submitComment = this.submitComment.bind(this);
    }

    submitComment(comment) {
        const data = new FormData();
        data.append('author', comment.author);
        data.append('text', comment.text);

        const xhr = new XMLHttpRequest();
        xhr.open('post', this.props.submitUrl, true);
        xhr.onload = () => this.loadComments();
        xhr.send(data);
    }
   
   loadComments() {
        const xhr = new XMLHttpRequest();
        xhr.open('get', this.props.url, true);
        xhr.onload = () => {
            const data = JSON.parse(xhr.responseText);
            this.setState({ data: data });//tells Reacts the component needs to be re-rendered
        };
        xhr.send();
    }
     //called on server rendering
    componentDidMount() {
        this.loadComments();
        window.setInterval(
            () => this.loadComments(),
            this.props.pollInterval,
        );
    }
    render() {
        return (
            <div className="commentBox">
            <h1>Comments</h1>
                <CommentList data={this.state.data} />
                <CommentForm onSubmitComment={this.submitComment} />
            </div>
        );
    }
}
class CommentList extends React.Component {
    render(){
        const commentNodes = this.props.data.map
            (
                comment => (
                    <Comment author={comment.author} key={comment.Id}>
                        {comment.text}
                    </Comment>
                 )
        )
        return <div className="commentList">{commentNodes}</div>
    }
}
class CommentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { author: '', text: '' };
        this.authorChange = this.authorChange.bind(this);
        this.textChange = this.textChange.bind(this);
        this.submit = this.submit.bind(this);
    }
    authorChange(e) {
        this.setState({ author: e.target.value });
    }
    textChange(e) {
        this.setState({ text: e.target.value });
    }
    submit(e) {
        e.preventDefault();
        const author = this.state.author.trim();
        const text = this.state.text.trim();
        if (!text || !author) {
            return;
        }
        this.props.onSubmitComment({ author: author, text: text });
        this.setState({ author: '', text: '' });
    }
    render() {
        //if input element has value --> controlled component
        return (
            <form className="commentForm" onSubmit={this.submit} >                
                <input type="text" placeholder="Your name" value={this.state.author} onChange={this.authorChange} /> 
                <input type="text" placeholder="Comment" value={this.state.text} onChange={this.textChange} />
                <input type="submit" value="post" />
            </form>)
    }
}
class Comment extends React.Component {
    render() {
        return (
            <div className="comment">
                <h2 className="commentAuthor">{this.props.author}</h2>
                {this.props.children}
            </div>
        )
    }
}
//instantiate root component

ReactDOM.render(
    //React.createElement(CommentBox, null),
    //document.getElementById('content'),
    //<CommentBox data={data} />,
    <CommentBox url="/comments" submitUrl="/comments/new" pollInterval={2000} />,
    document.getElementById('content')
);