$(document).ready(function() {
    // Example of checking authentication status (replace with your actual logic)
    $.get('/check_auth', function(response) {
        if (response.isAuthenticated) {
            $('#auth-links').hide();
            $('#user-links').removeClass('d-none');
        } else {
            $('#auth-links').removeClass('d-none');
            $('#user-links').hide();
        }
    });
});
