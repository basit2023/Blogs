// Ensure Supabase URL and Key are defined
if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
    console.error('Supabase URL or Anonymous Key is missing.');
    alert('Configuration error: Please provide a valid Supabase URL and Anonymous Key.');
} else {
    // Initialize Supabase client
    console.log("The key is available");
    const supabaseClient = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

    // Get the form element
    const form = document.getElementById('commentForm');

    // Add submit event listener
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            comment: document.getElementById('comment').value.trim(),
            rating: document.querySelector('input[name="rating"]:checked')?.value || null,
            created_at: new Date().toISOString(),
            blog:document.getElementById('blogName').value = "chicken-biryani",
        };

        try {
            // Validate form data
            if (!formData.name || !formData.email || !formData.comment) {
                alert('Please fill out all required fields.');
                return;
            }

            // Insert data into Supabase
            const { data, error } = await supabaseClient
                .from('comments')
                .insert([formData]);

            if (error) throw error;

            // Success message
            alert('Comment submitted successfully!');
            form.reset();
            loadComments("chicken-biryani");
        } catch (error) {
            console.error('Error:', error.message);
            alert('Error submitting comment. Please try again.');
        }
    });


    async function loadComments(blogName) {
        try {
            // Fetch comments where the blog_name matches
            const { data: comments, error } = await supabaseClient
                .from('comments')
                .select('*')
                .eq('blog', blogName)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const commentsContainer = document.querySelector('.list-comments-single');

            // Clear existing comments
            commentsContainer.innerHTML = '';

            // Render comments dynamically
            comments.forEach(comment => {
                // Create an avatar using name initials
                const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.name)}&background=random`;

                // Format date
                const formattedDate = new Date(comment.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                // Append comment to the container
                const commentHTML = `
                    <div class="item-comment">
                        <div class="comment-left">
                            <div class="box-author mb-20">
                                <img src="${avatar}" alt="${comment.name}">
                                <div class="author-info">
                                    <h6 class="color-gray-700">${comment.name}</h6>
                                    <span class="color-gray-700 text-sm mr-30">${formattedDate}</span>
                                </div>
                            </div>
                        </div>
                        <div class="comment-right">
                            <div class="text-comment text-xl color-gray-500 bg-gray-850 border-gray-800">${comment.comment}</div>
                        </div>
                    </div>
                `;
                commentsContainer.innerHTML += commentHTML;
            });
        } catch (error) {
            console.error('Error loading comments:', error.message);
            alert('Error loading comments. Please try again later.');
        }
    }
    window.loadComments = loadComments;

}
