
import { supabase } from '@/integrations/supabase/client';

export const seedBlogPosts = async () => {
  // Seed data for blog posts
  const posts = [
    {
      title: "The Art of Pruning Roses: A Comprehensive Guide",
      slug: "pruning-roses-guide",
      content: `
        <article class="prose lg:prose-xl">
          <h2>Why Prune Roses?</h2>
          <p>Pruning roses is essential for maintaining their health, encouraging abundant blooms, and shaping the plant to your desired form. Regular pruning removes dead or diseased wood, improves air circulation, and allows sunlight to penetrate the plant, promoting vigorous growth.</p>

          <img src="https://images.unsplash.com/photo-1617874399992-11988698e560?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHJvc2VzfGVufDB8fDB8fHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60" alt="Beautiful pruned rose bush" class="w-full rounded-lg my-8" />

          <h2>When to Prune</h2>
          <p>The best time to prune roses is in late winter or early spring, just as new growth begins to emerge. This timing allows you to remove any winter damage and shape the plant before it puts its energy into producing new leaves and flowers.</p>

          <h2>Tools You'll Need</h2>
          <ul>
            <li>Sharp pruning shears</li>
            <li>Loppers for thicker canes</li>
            <li>Gardening gloves</li>
            <li>Protective eyewear</li>
          </ul>

          <h2>Pruning Techniques</h2>
          <ol>
            <li><strong>Remove Dead or Diseased Wood:</strong> Cut back any canes that are brown, black, or show signs of disease.</li>
            <li><strong>Shape the Plant:</strong> Prune to create an open, vase-like shape, removing crossing or rubbing canes.</li>
            <li><strong>Encourage Blooming:</strong> Cut back healthy canes to an outward-facing bud to promote new growth and abundant blooms.</li>
          </ol>

          <h2>Additional Tips</h2>
          <ul>
            <li>Always make clean cuts to prevent disease.</li>
            <li>Dispose of pruned material properly to avoid spreading disease.</li>
            <li>Fertilize roses after pruning to encourage new growth.</li>
          </ul>
        </article>
      `,
      excerpt: "Learn the essential techniques for pruning roses to maintain their health, encourage abundant blooms, and shape the plant to your desired form.",
      featured_image: "https://images.unsplash.com/photo-1617874399992-11988698e560?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHJvc2VzfGVufDB8fDB8fHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60",
      published: true,
      published_at: new Date().toISOString(),
      author_id: "00000000-0000-0000-0000-000000000000", // Replace with a valid author ID
      category: "flowers"
    },
    {
      title: "Growing Tomatoes: A Step-by-Step Guide",
      slug: "growing-tomatoes-guide",
      content: `
        <article class="prose lg:prose-xl">
          <h2>Choosing the Right Variety</h2>
          <p>Selecting the right tomato variety is crucial for a successful harvest. Consider your climate, space, and desired fruit size when choosing your plants.</p>

          <img src="https://images.unsplash.com/photo-1560471343-9968b1c34a7a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dG9tYXRvZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60" alt="Lush tomato plants in a garden" class="w-full rounded-lg my-8" />

          <h2>Planting and Care</h2>
          <p>Tomatoes require well-drained soil, plenty of sunlight, and regular watering. Start seeds indoors 6-8 weeks before the last expected frost, and transplant seedlings outdoors once the weather has warmed up.</p>

          <h2>Common Problems and Solutions</h2>
          <ul>
            <li><strong>Blossom End Rot:</strong> Caused by calcium deficiency. Add calcium to the soil and ensure consistent watering.</li>
            <li><strong>Pests:</strong> Monitor plants for pests like aphids and tomato hornworms. Use organic pest control methods to protect your crop.</li>
          </ul>

          <h2>Harvesting Tips</h2>
          <p>Harvest tomatoes when they are fully colored and slightly soft to the touch. Gently twist the fruit from the vine, leaving the stem attached.</p>
        </article>
      `,
      excerpt: "A comprehensive guide to growing tomatoes, covering variety selection, planting, care, common problems, and harvesting tips.",
      featured_image: "https://images.unsplash.com/photo-1560471343-9968b1c34a7a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dG9tYXRvZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60",
      published: true,
      published_at: new Date().toISOString(),
      author_id: "00000000-0000-0000-0000-000000000000", // Replace with a valid author ID
      category: "vegetables"
    },
    {
      title: "Creating a Bee-Friendly Garden",
      slug: "bee-friendly-garden",
      content: `
        <article class="prose lg:prose-xl">
          <h2>Why Bees Matter</h2>
          <p>Bees are essential pollinators, playing a crucial role in our ecosystem and food production. Creating a bee-friendly garden provides them with the resources they need to thrive.</p>

          <img src="https://images.unsplash.com/photo-1558436944-f1148183c914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJlZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60" alt="A bee collecting pollen from a flower" class="w-full rounded-lg my-8" />

          <h2>Planting for Bees</h2>
          <p>Choose a variety of flowering plants that bloom at different times of the year to provide a continuous source of nectar and pollen. Native plants are particularly beneficial.</p>

          <h2>Providing Water</h2>
          <p>Bees need a source of fresh water. Provide a shallow dish or bird bath with pebbles or marbles for them to land on.</p>

          <h2>Avoiding Pesticides</h2>
          <p>Pesticides can harm or kill bees. Use organic gardening methods and avoid spraying chemicals on flowering plants.</p>
        </article>
      `,
      excerpt: "Learn how to create a bee-friendly garden by planting the right flowers, providing water, and avoiding pesticides.",
      featured_image: "https://images.unsplash.com/photo-1558436944-f1148183c914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJlZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60",
      published: true,
      published_at: new Date().toISOString(),
      author_id: "00000000-0000-0000-0000-000000000000", // Replace with a valid author ID
      category: "tips"
    },
    {
      title: "The Rise of Home Vegetable Gardens in the UK: A Growing Movement",
      slug: "uk-vegetable-gardening-trend",
      content: `
        <article class="prose lg:prose-xl">
          <p>The landscape of British gardens is undergoing a remarkable transformation. What was once dominated by ornamental plants and manicured lawns is increasingly giving way to productive vegetable patches and edible gardens. This shift represents more than just a change in gardening preferences; it's a movement towards sustainability, self-sufficiency, and reconnection with our food sources.</p>

          <img src="/lovable-uploads/e735d80e-4216-424a-935a-792ac7951cbe.png" alt="Beautiful UK vegetable garden with raised beds" class="w-full rounded-lg my-8" />

          <h2>The Growing Trend</h2>
          <p>Recent years have seen a significant surge in the number of UK households growing their own vegetables. This increase has been particularly notable since 2020, with estimates suggesting that over 60% of British homes with gardens now dedicate some space to growing food.</p>

          <h2>Why Are More Britons Growing Their Own?</h2>
          <ul>
            <li>Rising food costs and inflation have made home-grown produce more appealing</li>
            <li>Increased awareness of environmental impact of commercial farming</li>
            <li>Better understanding of the nutritional benefits of fresh produce</li>
            <li>Growing interest in organic and pesticide-free vegetables</li>
            <li>Mental health benefits associated with gardening</li>
          </ul>

          <h2>Making the Most of Limited Space</h2>
          <p>As shown in our featured image, modern British vegetable gardens often utilize raised beds - a perfect solution for the UK's variable climate and soil conditions. These organized, geometric layouts maximize growing space while maintaining accessibility and aesthetic appeal. The combination of vegetables, herbs, and companion flowers creates a productive and beautiful space that challenges the traditional separation of ornamental and kitchen gardens.</p>

          <h2>Popular Crops in UK Home Gardens</h2>
          <p>British gardeners are particularly successful with:</p>
          <ul>
            <li>Leafy greens (lettuce, kale, chard)</li>
            <li>Root vegetables (potatoes, carrots, beetroot)</li>
            <li>Peas and beans</li>
            <li>Herbs (mint, rosemary, thyme)</li>
            <li>Brassicas (cabbage, broccoli, Brussels sprouts)</li>
          </ul>

          <h2>The Future of Home Gardening</h2>
          <p>With climate change and food security becoming increasingly important issues, the trend of home vegetable gardening is likely to continue growing. Many local councils are also supporting this movement by increasing allotment availability and providing gardening education programs.</p>

          <p>Whether you have a sprawling suburban garden or a modest urban space, growing your own vegetables is becoming an increasingly accessible and rewarding endeavor for UK residents. The benefits extend beyond fresh produce to include improved mental health, reduced carbon footprint, and a stronger sense of community through shared gardening knowledge and produce exchange.</p>
        </article>
      `,
      excerpt: "Discover how more UK residents are transforming their gardens into productive vegetable patches, reflecting a growing movement towards sustainable living and self-sufficiency.",
      featured_image: "/lovable-uploads/e735d80e-4216-424a-935a-792ac7951cbe.png",
      published: true,
      published_at: new Date().toISOString(),
      author_id: "00000000-0000-0000-0000-000000000000", // Default author ID
      category: "vegetables"
    },
  ];

  console.log("Starting to seed blog posts, count:", posts.length);

  // First let's check if we have any posts already
  const { count, error: countError } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact', head: true });
    
  if (countError) {
    console.error("Error checking blog posts count:", countError);
    throw countError;
  }

  console.log("Current blog post count:", count);

  // Instead of deleting all posts, let's use upsert to update existing ones and add new ones
  for (const post of posts) {
    console.log(`Processing blog post: ${post.title}`);
    const { data, error } = await supabase
      .from('blog_posts')
      .upsert({
        ...post,
      }, {
        onConflict: 'slug',
      });

    if (error) {
      console.error('Error seeding blog post:', post.title, error);
    } else {
      console.log('Seeded blog post:', post.title);
    }
  }
  
  console.log("Completed blog post seeding");
};
