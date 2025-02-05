// Ensure Supabase URL and Key are defined
if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
    console.error('Supabase URL or Anonymous Key is missing.');
  
} else {
    // Initialize Supabase client
    console.log("The key is available");
    const blog=document.getElementById('blogName').value;
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
            blog:document.getElementById('blogName').value,
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
            loadComments(formData.blog);
        } catch (error) {
            console.error('Error:', error.message);
            
        }
    });


    async function loadComments(blogName) {
        try {
            // Fetch comments from Supabase
            const { data: comments, error } = await supabaseClient
                .from('comments')
                .select('*')
                .eq('blog', blogName)
                .order('created_at', { ascending: false });
    
            if (error) throw error;
    
            const commentsContainer = document.querySelector('.list-comments-single');
            const avgRatingContainer = document.getElementById('averageRating');
    
            // Clear existing comments
            commentsContainer.innerHTML = '';
    
            let totalRating = 0;
            let ratingCount = 0;
    
            comments.forEach(comment => {
                const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.name)}&background=random`;
    
                const formattedDate = new Date(comment.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
    
                // Generate star rating HTML
                let stars = "";
                const rating = comment.rating ? parseInt(comment.rating) : 0;
                if (rating > 0) {
                    totalRating += rating;
                    ratingCount++;
                }
                for (let i = 1; i <= 5; i++) {
                    stars += `<span style="color: ${i <= rating ? 'gold' : 'gray'}; font-size: 16px;">★</span>`;
                }
    
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
    
            // Calculate and display average rating
            if (ratingCount > 0) {
                const avgRating = (totalRating / ratingCount).toFixed(1);
                let avgStars = "";
                for (let i = 1; i <= 5; i++) {
                    avgStars += `<span style="color: ${i <= avgRating ? 'gold' : 'gray'}; font-size: 20px;">★</span>`;
                }
    
                avgRatingContainer.innerHTML = `
                    <h3 class="color-linear">Average Rating: ${avgRating} / 5</h3>
                    <div class="average-rating-stars">${avgStars}</div>
                `;
            } else {
                avgRatingContainer.innerHTML = `<h3 class="color-linear">No ratings yet</h3>`;
            }
    
        } catch (error) {
            console.error('Error loading comments:', error.message);
          
        }
    }
    
    
    window.loadComments = loadComments;

}
