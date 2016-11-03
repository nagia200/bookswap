var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
	body: String,
	author: String,
	favorites: {type: Number, default: 0},
	book: {type: mongoose.Schema.Types.ObjectId, ref: 'Book'}
});

CommentSchema.methods.favorite = function(cb) {
	this.favorites += 1;
	this.save(cb);
};

mongoose.model('Comment', CommentSchema);
