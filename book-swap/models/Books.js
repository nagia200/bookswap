var mongoose = require('mongoose');

var BookSchema = new mongoose.Schema({
	title: String,
	author: String,
	favorites: {type: Number, default: 0},
	comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
});

BookSchema.methods.favorite = function(cb) {
  this.favorites += 1;
  this.save(cb);
};

mongoose.model('Book', BookSchema);
