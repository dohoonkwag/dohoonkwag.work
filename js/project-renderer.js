document.addEventListener('DOMContentLoaded', function () {
    const projectContainer = document.getElementById('project-container');

    const urlParams = new URLSearchParams(window.location.search);
    const projectSlug = urlParams.get('p');

    if (!projectSlug) {
        projectContainer.innerHTML = `
            <h2 style="font-family: var(--serif); color: var(--ink);">No project specified.</h2>
            <p style="color: var(--ink-muted);">Use a URL like <code>project.html?p=my-project-filename</code></p>
        `;
        return;
    }

    const markdownFilePath = `./projects/${projectSlug}.md`;

    fetch(markdownFilePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Project not found: ${markdownFilePath} (${response.status})`);
            }
            return response.text();
        })
        .then(markdownText => {
            // Parse the markdown
            const htmlContent = marked.parse(markdownText);

            // Inject into container
            projectContainer.innerHTML = htmlContent;

            // Update page title if an H1 exists
            const h1 = projectContainer.querySelector('h1');
            if (h1) {
                document.title = `${h1.textContent} — Dohoon Kwag`;
            }
        })
        .catch(error => {
            console.error('Error loading project:', error);
            projectContainer.innerHTML = `
                <h2 style="font-family: var(--serif); color: var(--ink);">Couldn't load this project.</h2>
                <p style="color: var(--ink-muted);">${error.message}</p>
                <p style="color: var(--ink-muted); margin-top: 1rem;">
                    <a href="./projects.html" style="color: var(--amber);">← Back to Projects</a>
                </p>
            `;
        });
});
