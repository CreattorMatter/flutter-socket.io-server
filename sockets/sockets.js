const {io} = require('../index');
const Band = require('../public/models/band');
const Bands = require('../public/models/bands');

const bands = new Bands();

bands.addBand( new Band('Queen'));
bands.addBand( new Band('Metallica'));
bands.addBand( new Band('Lamb of god'));
bands.addBand( new Band('Arch Enemy'));


io.on('connection', client => {
    console.log('cliente conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => { console.log('cliente desconectado') });

    client.on('mensaje', (payload )=>{
        console.log('Hola', payload)

        io.emit('mensaje',{ admin: 'Nuevo mensaje'});
    })

    client.on('emitir-mensaje', (payload )=>{
        client.broadcast.emit('emitir-mensaje',payload);
    })
    
    client.on('vote-band', function(payload){
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

    client.on('add-band', function(payload){
        const newBand = new Band(payload.name);
        bands.addBand(newBand);
        io.emit('active-bands', bands.getBands());
    });

    client.on('delete-band', function(payload){
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

  });