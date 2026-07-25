document.addEventListener('DOMContentLoaded', function () {
    const postContainer = document.getElementById('post-container');

    const urlParams    = new URLSearchParams(window.location.search);
    const postFileName = urlParams.get('post');

    if (!postFileName) {
        postContainer.innerHTML = `
            <h2 style="font-family: var(--serif); color: var(--ink);">No post specified.</h2>
            <p style="color: var(--ink);">Use a URL like <code>post.html?post=my-post-filename</code></p>
        `;
        return;
    }

    const markdownFilePath = `./posts/${postFileName}.md`;

    fetch(markdownFilePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Post not found: ${markdownFilePath} (${response.status})`);
            }
            return response.text();
        })
        .then(markdownText => {
            // Parse the markdown
            const htmlContent = marked.parse(markdownText);

            // Inject into container
            postContainer.innerHTML = htmlContent;

            // Update page title if an H1 exists
            const h1 = postContainer.querySelector('h1');
            if (h1) {
                document.title = `${h1.textContent} — Dohoon Kwag`;
            }
        })
        .catch(error => {
            console.error('Error loading post:', error);
            postContainer.innerHTML = `
                <h2 style="font-family: var(--serif); color: var(--ink);">Couldn't load this post.</h2>
                <p style="color: var(--ink);">${error.message}</p>
                <p style="color: var(--ink); margin-top: 1rem;">
                    <a href="./projects.html" style="color: var(--red);">← Back to Projects</a>
                </p>
            `;
        });
});