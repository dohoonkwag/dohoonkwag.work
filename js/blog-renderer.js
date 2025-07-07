document.addEventListener('DOMContentLoaded', function() {
    // 1. Get the container where the post will be displayed
    const postContainer = document.getElementById('post-container');

    // 2. Determine which Markdown file to load
    //    We'll use URL parameters to specify the post.
    //    Example URL: post.html?post=my-first-post
    const urlParams = new URLSearchParams(window.location.search);
    const postFileName = urlParams.get('post'); // Gets 'my-first-post'

    if (!postFileName) {
        postContainer.innerHTML = '<h2>Error: No post specified.</h2><p>Please use a URL like `post.html?post=my-first-post`</p>';
        return; // Stop execution if no post name is provided
    }

    // 3. Construct the path to the Markdown file
    const markdownFilePath = `./posts/${postFileName}.md`;

    // 4. Fetch the Markdown content
    fetch(markdownFilePath)
        .then(response => {
            if (!response.ok) {
                // If the file isn't found (e.g., 404 error)
                throw new Error(`HTTP error! status: ${response.status} - Could not find post: ${markdownFilePath}`);
            }
            return response.text(); // Get the response body as plain text
        })
        .then(markdownText => {
            // 5. Convert Markdown to HTML using marked.js
            const htmlContent = marked.parse(markdownText);

            // 6. Inject the HTML into the container
            postContainer.innerHTML = htmlContent;
        })
        .catch(error => {
            // 7. Handle any errors during fetching or parsing
            console.error('Error loading or parsing Markdown:', error);
            postContainer.innerHTML = `<h2>Error Loading Post</h2><p>${error.message}</p><p>Please check the file name and path.</p>`;
        });
});