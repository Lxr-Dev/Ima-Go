

registerSW();

function registerSW() { 
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/public/service-worker.js', {scope: '/'})
        .then((reg) => {
            console.log('Service worker registered -->', reg);
        }, (err) => {
            console.error('Service worker not registered -->', err);
        });
    }
} 
