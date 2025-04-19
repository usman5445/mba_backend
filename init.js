const User = require('./models/user.model')
const Movie = require('./models/movie.model')
const Theatre = require('./models/theatre.model')
const constants = require('./utils/constants')
const bcrypt = require('bcryptjs')
const Booking = require('./models/booking.model')
const Payment = require('./models/payment.model')

module.exports = async ()=>{
    try{

        await User.collection.drop();
        console.log("#### User collection dropped ####");
        await Movie.collection.drop();
        console.log("#### Movie collection dropped ####");
        await Theatre.collection.drop();
        console.log("#### Theatre collection dropped ####");
        await Booking.collection.drop();
        console.log("Booking collection dropped ");
        await Payment.collection.drop();
        console.log("#### Payment collection dropped ####");

        await User.create({
            name : "Usman",
            userId : "admin",
            password : bcrypt.hashSync("AdminOfTheApp@123",8),
            email : "usman@admin.com",
            userType : constants.userTypes.admin
        });


        console.log("#### Admin user created ####");

        const users = [];
        users[0] = {
            name : "Usman Customer",
            userId : "customer1",
            password : bcrypt.hashSync("Customer@1",8),
            email : "usman@customer.com",
            userType : constants.userTypes.customer
        },
        users[1] = {
            name : "Theatre Owner 1",
            userId : "theatreOwner1",
            password : bcrypt.hashSync("TheatreOwner@1",8),
            email : "theatreOwner1@app.com",
            userType : constants.userTypes.theatre_owner
        },
        users[2] = {
            name : "Theatre Owner 2",
            userId : "theatreOwner2",
            password : bcrypt.hashSync("TheatreOwner@2",8),
            email : "theatreOwner2@app.com",
            userType : constants.userTypes.theatre_owner
        },

        usersCreated = await User.insertMany(users);

        const theatres = [];
        theatres[0] = {
            ownerId : usersCreated[1]._id,
            name : "Theatre 1",
            description : "Description for theatre 1",
            city : "Mumbai",
            pinCode : 400049,
            showTypes : [constants.theatreShows.morning, constants.theatreShows.noon, constants.theatreShows.evening, constants.theatreShows.night],
            numberOfSeats : 100,
            ticketPrice : 145
        },
        theatres[1] = {
            ownerId : usersCreated[2]._id,
            name : "Theatre 2",
            description : "Description for theatre 2",
            city : "Ahmedabad",
            pinCode : 380007,
            showTypes : [constants.theatreShows.evening, constants.theatreShows.night],
            numberOfSeats : 50,
            ticketPrice : 120
        },
        theatres[2] = {
            ownerId : usersCreated[2]._id,
            name : "Theatre 3",
            description : "Description for theatre 3",
            city : "New Delhi",
            pinCode : 110031,
            showTypes : [constants.theatreShows.evening],
            numberOfSeats : 75,
            ticketPrice : 235
        }

        theatresCreated = await Theatre.insertMany(theatres);
        await usersCreated[1].theatresOwned.push(theatresCreated[0]._id);
        await usersCreated[2].theatresOwned.push(theatresCreated[1]._id, theatresCreated[2]._id);
        await usersCreated[1].save();
        await usersCreated[2].save();

        const movies = [];
        movies[0] = {
            name: "Inception",
            description: "A thief who steals corporate secrets through dream-sharing faces his biggest challenge yet.",
            casts: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
            trailerUrls: ["https://youtu.be/YoHD9XEInc0"],
            posterUrls: ["https://example.com/inception/poster.jpg"],
            languages: ["English", "French"],
            releaseDate: "2010-07-16",
            releaseStatus: constants.movieReleaseStatuses.released,
            imdbRating: 8.8,
            genre: [constants.movieGenre.action, constants.movieGenre.sci_fi]
        },
        movies[1] = {
            name: "The Dark Knight",
            description: "Batman battles the Joker, a criminal mastermind who tests his moral limits.",
            casts: ["Christian Bale", "Heath Ledger", "Gary Oldman"],
            trailerUrls: ["https://youtu.be/EXeTwQWrcwY"],
            posterUrls: ["https://example.com/darkknight/poster.jpg"],
            languages: ["English"],
            releaseDate: "2008-07-18",
            releaseStatus: constants.movieReleaseStatuses.released,
            imdbRating: 9.0,
            genre: [constants.movieGenre.action]
        },
        movies[2] = {
            name: "Interstellar",
            description: "A team of explorers travels through a wormhole in search of a new home for humanity.",
            casts: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
            trailerUrls: ["https://youtu.be/zSWdZVtXT7E"],
            posterUrls: ["https://example.com/interstellar/poster.jpg"],
            languages: ["English"],
            releaseDate: "2014-11-07",
            releaseStatus: constants.movieReleaseStatuses.released,
            imdbRating: 8.6,
            genre: [constants.movieGenre.sci_fi, constants.movieGenre.adventure]
        }

        moviesCreated = await Movie.insertMany(movies);

        await theatresCreated[0].movies.push(moviesCreated[0]._id, moviesCreated[1]._id)
        await moviesCreated[0].theatres.push(theatresCreated[0]._id)
        await moviesCreated[1].theatres.push(theatresCreated[0]._id)
    
        await theatresCreated[0].save()
        await moviesCreated[0].save()
        await moviesCreated[1].save()

        const booking = await Booking.create({
            totalCost : 200,
            theatreId : theatresCreated[0]._id,
            movieId : moviesCreated[0]._id,
            userId : usersCreated[0]._id,
            noOfSeats : 2,
            ticketBookedTime : Date.now(),
            status : constants.bookingStatuses.completed
        });

        await usersCreated[0].myBookings.push(booking._id)
        await moviesCreated[0].bookings.push(booking._id)

        await usersCreated[0].save();
        await theatresCreated[0].save();
        await moviesCreated[0].save();

        const payment = await Payment.create({
            bookingId : booking._id,
            amount : 200,
            status : constants.paymentStatuses.success
        })

        await usersCreated[0].myPayments.push(payment._id);
        await usersCreated[0].save();


        console.log("#### Seed data initialized ####");
    }
    catch(err){
        console.log("#### Error in seed data initialization #### ", err.message);
    }
}