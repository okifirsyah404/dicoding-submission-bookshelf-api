const { nanoid } = require('nanoid');
let books = require('../data/books');

const addBookHandler = (request, h) => {
	const {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
	} = request.payload;

	const id = nanoid(16);
	const finished = !(readPage < pageCount);
	const insertedAt = new Date().toISOString();
	const updatedAt = insertedAt;

	const tempBook = [];

	const newBook = {
		id,
		name,
		year: parseInt(year, 10),
		author: author.toString(),
		summary: summary.toString(),
		publisher,
		pageCount: parseInt(pageCount, 10),
		readPage: parseInt(readPage, 10),
		finished,
		reading,
		insertedAt,
		updatedAt,
	};

	tempBook.push(newBook);

	if (!name) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal menambahkan buku. Mohon isi nama buku',
		});

		return response.code(400);
	}

	if (readPage > pageCount) {
		const response = h.response({
			status: 'fail',
			message:
				'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
		});

		return response.code(400);
	}

	if (tempBook.filter((book) => book.id === id).length > 0) {
		books = books.concat(tempBook);

		const response = h.response({
			status: 'success',
			message: 'Buku berhasil ditambahkan',
			data: {
				bookId: id,
			},
		});

		return response.code(201);
	}

	const response = h.response({
		status: 'fail',
		message: 'Buku gagal ditambahkan',
	});

	return response.code(500);
};

const getAllBooksHandler = (request, h) => {
	const { name, reading, finished } = request.query;
	const isBookReading = Boolean(Number.parseInt(reading, 10));
	const isBookFinished = Boolean(Number.parseInt(finished, 10));
	let booksQuery = books;

	if (name) {
		booksQuery = books.filter((book) =>
			book.name.toLowerCase().includes(name.toLowerCase())
		);
	}

	if (reading) {
		booksQuery = books.filter((book) => book.reading === isBookReading);
	}

	if (finished) {
		booksQuery = books.filter((book) => book.finished === isBookFinished);
	}

	const response = h.response({
		status: 'success',
		data: {
			books: booksQuery.map((book) => ({
				id: book.id,
				name: book.name,
				publisher: book.publisher,
			})),
		},
	});

	return response.code(200);
};

const getSpecifiedBookByIdHandler = (request, h) => {
	const { bookId } = request.params;
	const book = books.filter((b) => b.id === bookId)[0];

	if (book !== undefined && book !== null) {
		const response = h.response({
			status: 'success',
			data: {
				book,
			},
		});

		return response.code(200);
	}
	const response = h.response({
		status: 'fail',
		message: 'Buku tidak ditemukan',
	});

	return response.code(404);
};

const editBookByIdHandler = (request, h) => {
	const { bookId } = request.params;
	const {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
	} = request.payload;
	const updatedAt = new Date().toISOString();

	const index = books.findIndex((book) => book.id === bookId);

	if (!name) {
		const response = h.response({
			status: 'fail',
			message: 'Gagal memperbarui buku. Mohon isi nama buku',
		});

		return response.code(400);
	}

	if (readPage > pageCount) {
		const response = h.response({
			status: 'fail',
			message:
				'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
		});

		return response.code(400);
	}

	if (index !== -1) {
		books[index] = {
			...books[index],
			name,
			year,
			author,
			summary,
			publisher,
			pageCount,
			readPage,
			reading,
			updatedAt,
		};

		const response = h.response({
			status: 'success',
			message: 'Buku berhasil diperbarui',
		});

		return response.code(200);
	}

	const response = h.response({
		status: 'fail',
		message: 'Gagal memperbarui buku. Id tidak ditemukan',
	});

	return response.code(404);
};

const deleteBookByIdHandler = (request, h) => {
	const { bookId } = request.params;

	const index = books.findIndex((book) => book.id === bookId);

	if (index !== -1) {
		books.splice(index, 1);

		const response = h.response({
			status: 'success',
			message: 'Buku berhasil dihapus',
		});

		return response.code(200);
	}
	const response = h.response({
		status: 'fail',
		message: 'Buku gagal dihapus. Id tidak ditemukan',
	});
	return response.code(404);
};

module.exports = {
	getAllBooksHandler,
	addBookHandler,
	getSpecifiedBookByIdHandler,
	editBookByIdHandler,
	deleteBookByIdHandler,
};
