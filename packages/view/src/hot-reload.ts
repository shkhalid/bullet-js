export const hotReloadScript = `
<script>
(function() {
    let disconnected = false;
    
    function connect() {
      // Just a simple polling mechanism for now as Bun --watch kills the server
      setInterval(() => {
        fetch('/_bullet/ping')
            .then(() => {
                if (disconnected) {
                    window.location.reload();
                }
            })
            .catch(() => {
                disconnected = true;
                console.log('[BulletJS] Connection lost. Waiting to reload...');
            });
      }, 1000);
    }
    
    connect();
})();
</script>
`;
