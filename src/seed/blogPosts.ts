
import { supabase } from '@/integrations/supabase/client';

// Function to add sample blog posts to the database
export const seedBlogPosts = async (userId: string) => {
  // Check if there are already blog posts
  const { data: existingPosts } = await supabase
    .from('blog_posts')
    .select('id')
    .limit(1);

  if (existingPosts && existingPosts.length > 0) {
    console.log('Blog posts already exist. Skipping seed.');
    return;
  }

  const blogPosts = [
    {
      title: "Spring Gardening Essentials: Prepare Your Garden for a Blooming Season",
      slug: "spring-gardening-essentials",
      excerpt: "Discover the essential steps to prepare your garden for spring, from soil preparation to selecting the right plants for your climate.",
      content: `
# Spring Gardening Essentials: Prepare Your Garden for a Blooming Season

As the winter frost melts away and the days grow longer, it's time to prepare your garden for the vibrant growing season ahead. Spring is a crucial time for gardeners, setting the foundation for a successful year of blooming flowers, thriving vegetables, and abundant harvests.

## Soil Preparation: The Foundation of a Healthy Garden

Before planting anything, it's essential to prepare your soil properly. Start by removing any debris, dead plants, and weeds from your garden beds. Next, test your soil's pH level and nutrient content to understand what amendments it might need.

Most plants thrive in soil with a pH between 6.0 and 7.0. If your soil is too acidic (below 6.0), add lime to raise the pH. If it's too alkaline (above 7.0), add sulfur to lower it.

Once you've addressed the pH, enrich your soil with organic matter like compost, well-rotted manure, or leaf mold. This improves soil structure, adds nutrients, and enhances water retention.

## Planning Your Garden Layout

Take time to plan your garden layout before planting. Consider the following factors:

1. **Sunlight requirements**: Observe how sunlight falls on your garden throughout the day and place plants accordingly.
2. **Plant height**: Position taller plants where they won't shade shorter ones.
3. **Companion planting**: Some plants grow better together, while others inhibit each other's growth.
4. **Crop rotation**: If you're growing vegetables, avoid planting the same family in the same spot year after year to prevent soil-borne diseases.

## Selecting the Right Plants for Your Climate

Choose plants that are well-suited to your local climate and growing conditions. Native plants are often the best choice as they're adapted to the local environment and require less maintenance.

For vegetable gardens, select varieties that will have time to mature within your growing season. In regions with shorter summers, choose fast-maturing varieties or start seeds indoors to get a head start.

## Starting Seeds Indoors

Many plants benefit from being started indoors 6-8 weeks before the last frost date. This gives them a head start and extends your growing season. Use quality seed-starting mix and containers with drainage holes.

Provide adequate light, either from a sunny window or grow lights, and keep the soil consistently moist but not waterlogged.

## Pruning and Cleaning Existing Plants

Spring is the perfect time to prune many shrubs and perennials. Remove dead or damaged branches, shape overgrown plants, and cut back ornamental grasses and perennials that were left standing for winter interest.

Clean up around existing plants, removing debris that might harbor pests or diseases.

## Mulching for Moisture Retention and Weed Control

Once the soil has warmed up and you've planted your garden, apply a layer of mulch. Organic mulches like straw, wood chips, or compost help retain soil moisture, suppress weeds, and add nutrients to the soil as they break down.

Apply a 2-3 inch layer of mulch around plants, keeping it away from direct contact with stems to prevent rot.

## Setting Up a Watering System

Efficient watering is crucial for a thriving garden. Consider setting up a drip irrigation system or soaker hoses, which deliver water directly to the soil, reducing waste and keeping foliage dry (which helps prevent many plant diseases).

If you're watering by hand, do so deeply and less frequently to encourage deep root growth.

## Conclusion

Investing time in proper spring garden preparation pays dividends throughout the growing season. With well-prepared soil, thoughtfully selected plants, and good maintenance practices, your garden will be set up for success in the months ahead.

Remember, gardening is both an art and a science, so don't be afraid to experiment, learn from your experiences, and adapt your approach based on what works best in your unique garden space.
      `,
      published: true,
      published_at: new Date().toISOString(),
      author_id: userId,
      featured_image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    },
    {
      title: "Summer Garden Maintenance: Tips for Thriving Plants in Hot Weather",
      slug: "summer-garden-maintenance",
      excerpt: "Learn how to keep your garden flourishing during the hot summer months with these essential maintenance tips and watering strategies.",
      content: `
# Summer Garden Maintenance: Tips for Thriving Plants in Hot Weather

When summer temperatures soar, gardens face unique challenges. Heat stress, drought, and increased pest activity can all take a toll on your carefully tended plants. However, with proper maintenance and care, your garden can not only survive but thrive during the hottest months of the year.

## Watering Wisely

Proper watering is perhaps the most critical aspect of summer garden care:

- **Water deeply and less frequently** rather than shallowly and often. This encourages plants to develop deeper root systems that can access moisture further down in the soil.
- **Water in the early morning** when temperatures are cooler, reducing evaporation and giving plants time to dry before evening (which helps prevent fungal diseases).
- **Use drip irrigation or soaker hoses** to deliver water directly to the soil where it's needed, minimizing waste and keeping foliage dry.
- **Consider installing a rain barrel** to collect and reuse rainwater, which is free of chemicals and at ambient temperature.

## Mulching Matters

A good layer of mulch is your garden's best friend during hot weather:

- Apply a 2-3 inch layer of organic mulch like straw, wood chips, or shredded leaves around your plants.
- Mulch helps retain soil moisture, suppress weeds, and keep soil temperatures more moderate.
- Replenish mulch as needed throughout the summer as it breaks down.

## Pruning and Deadheading

Regular maintenance pruning keeps plants healthy and productive:

- Remove spent flowers (deadheading) to encourage continued blooming and prevent plants from going to seed too early.
- Prune out damaged or diseased branches promptly to prevent issues from spreading.
- For vegetable gardens, harvest regularly to encourage continued production.

## Pest Management

Hot weather often brings increased pest activity. Stay vigilant with these strategies:

- Inspect plants regularly for signs of insect damage or disease.
- Consider introducing beneficial insects like ladybugs or praying mantises to control pest populations naturally.
- Use organic pest control methods when possible, such as insecticidal soaps or neem oil.
- Remove severely infested plants to prevent pests from spreading to healthy ones.

## Heat-Tolerant Planting

If you're adding plants to your garden in summer:

- Choose heat-tolerant varieties adapted to your climate zone.
- Plant during cooler parts of the day, either early morning or evening.
- Provide temporary shade for newly planted specimens for the first few days.
- Water new plantings more frequently until they become established.

## Lawn Care

Lawns require special attention during hot weather:

- Raise your mower blade to cut grass higher (about 3-4 inches). Taller grass shades the soil, reducing evaporation and discouraging weed growth.
- Leave grass clippings on the lawn as a natural mulch and nutrient source.
- Consider letting your lawn go dormant during extreme heat if water is scarce. Most grass species will recover when cooler, wetter weather returns.

## Container Garden Care

Potted plants are especially vulnerable to heat stress:

- Move containers to shadier locations during the hottest part of the day if possible.
- Water container plants more frequently, as they dry out faster than in-ground plantings.
- Consider using self-watering containers or water-absorbing crystals in potting mix to help maintain moisture.
- Group containers together to create a more humid microclimate.

## Conclusion

With thoughtful care and maintenance, your garden can flourish even during the challenging summer months. Remember that different plants have different needs, so observe your garden closely and be responsive to signs of stress. A little extra attention during hot weather will be rewarded with a vibrant, productive garden throughout the summer season.
      `,
      published: true,
      published_at: new Date().toISOString(),
      author_id: userId,
      featured_image: "https://images.unsplash.com/photo-1621983209149-c9d8a9b8eda9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    },
    {
      title: "Fall Gardening: Preparing Your Garden for the Cooler Months",
      slug: "fall-gardening-preparation",
      excerpt: "Fall is the perfect time to prepare your garden for winter and set the stage for a successful spring growing season.",
      content: `
# Fall Gardening: Preparing Your Garden for the Cooler Months

As summer fades and temperatures begin to drop, gardeners face a new set of tasks and opportunities. Fall gardening is about both enjoying the last harvests of the year and preparing your garden for the dormant winter months ahead. With proper fall maintenance, you'll set yourself up for a more successful spring garden.

## Harvesting Late Season Crops

Many vegetables continue to produce well into fall, especially in moderate climates:

- Root vegetables like carrots, beets, and parsnips can be harvested through fall and even into early winter in some regions.
- Leafy greens such as kale, collards, and Swiss chard often taste sweeter after light frosts.
- Winter squash and pumpkins should be harvested before hard frost, when their rinds are hard and fully colored.
- Herbs can be harvested and dried or frozen for winter use.

## Planting for Fall and Beyond

Fall is an excellent time for certain types of planting:

- **Spring-flowering bulbs** like tulips, daffodils, and crocuses should be planted in fall before the ground freezes.
- **Cool-season vegetables** such as spinach, lettuce, kale, and radishes can be planted for fall harvests.
- **Trees and shrubs** often establish better when planted in fall, as they can focus on root growth without the stress of summer heat.
- **Garlic and shallots** planted in fall will develop roots before winter and be ready to grow vigorously in early spring.

## Soil Care and Improvement

Fall is the ideal time to rejuvenate your garden soil:

- Test your soil pH and nutrient levels to determine what amendments might be needed.
- Add compost, aged manure, or leaf mold to beds to improve soil structure and fertility.
- Consider planting cover crops like clover, winter rye, or hairy vetch to prevent erosion, suppress weeds, and add organic matter when tilled in spring.
- Avoid working with soil when it's too wet, as this can damage soil structure.

## Cleaning and Organizing Garden Beds

A thorough fall cleanup can prevent many pest and disease problems:

- Remove diseased plant material and dispose of it in the trash, not the compost pile.
- Healthy plant debris can be composted or chopped and left in place as mulch.
- Pull annual weeds before they set seed, and tackle perennial weeds while the ground is still workable.
- Apply a layer of mulch to bare soil to protect it from erosion and moderate temperature fluctuations.

## Protecting Perennials

Help your perennial plants survive winter with these strategies:

- **Mulching:** Apply a layer of mulch around perennials after the ground has frozen to prevent frost heaving.
- **Wrapping:** Young trees may need trunk guards to prevent rodent damage or sunscald.
- **Cutting back:** Some perennials benefit from cutting back in fall, while others provide winter interest and habitat for beneficial insects if left standing until spring.
- **Division:** Fall is an excellent time to divide overcrowded perennials like hostas, daylilies, and irises.

## Tool Maintenance

Before storing your garden tools for winter:

- Clean soil from all tools and disinfect pruners and other cutting tools with a 10% bleach solution.
- Sharpen dull blades on pruners, shears, and shovels.
- Oil wooden handles with linseed oil to prevent cracking and splitting.
- Drain and properly store hoses and irrigation equipment before freezing temperatures arrive.

## Planning for Next Year

Use the quieter fall season to reflect and plan:

- Keep notes on what worked well and what didn't in your garden this year.
- Sketch out garden plans for next season, considering crop rotation for vegetable gardens.
- Collect and properly store seeds from your garden for planting next year.
- Take inventory of your garden supplies and make a list of what you'll need for spring.

## Conclusion

Fall gardening offers a perfect balance of harvesting the bounty of the current season while looking ahead to future growth. By properly preparing your garden for winter, you'll not only protect your investment in plants and soil but also set yourself up for a more productive and enjoyable garden next year. Embrace the rhythms of the seasons and use this natural transition time to give your garden the attention it needs.
      `,
      published: true,
      published_at: new Date().toISOString(),
      author_id: userId,
      featured_image: "https://images.unsplash.com/photo-1508060793804-ba3a159de72d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    },
    {
      title: "Winter Gardening: Indoor Projects and Planning for Spring",
      slug: "winter-gardening-projects",
      excerpt: "Discover how to keep your gardening passion alive during winter with indoor gardening projects and planning for the spring season.",
      content: `
# Winter Gardening: Indoor Projects and Planning for Spring

When frost covers the ground and outdoor gardening activities are limited, passionate gardeners can still nurture their green thumbs with indoor projects and strategic planning. Winter offers a valuable opportunity to reflect, learn, and prepare for the upcoming growing season while enjoying the comfort of indoor gardening.

## Indoor Herb Gardens

Fresh herbs add flavor to winter cooking and bring a touch of green into your home:

- **Select the right herbs:** Basil, parsley, chives, mint, and rosemary all grow well indoors.
- **Provide adequate light:** Most herbs need at least 6 hours of sunlight. A sunny south-facing window is ideal, or supplement with grow lights.
- **Use well-draining soil** and containers with drainage holes to prevent root rot.
- **Harvest regularly** to encourage bushy growth and prevent flowering, which can make herbs bitter.

## Growing Microgreens and Sprouts

Microgreens and sprouts provide fresh nutrition and satisfaction with minimal space and equipment:

- **Microgreens** are seedlings harvested when they're 1-3 inches tall with their first true leaves. Try arugula, radish, sunflower, or pea shoots.
- **Sprouts** like alfalfa, broccoli, and mung bean can be grown in a jar with just water and proper rinsing.
- Both are packed with nutrients and can be ready to harvest in as little as 1-2 weeks.
- They require minimal light and can thrive on a kitchen countertop.

## Houseplant Care

Winter is the perfect time to focus attention on your houseplants:

- **Adjust watering:** Most plants require less water during winter's shorter days.
- **Clean leaves** regularly to remove dust and help plants photosynthesize efficiently.
- **Watch humidity levels,** especially in homes with forced-air heating. Consider using a humidifier or grouping plants together.
- **Rotate plants** regularly to ensure even growth and check for pests, which can multiply rapidly in indoor conditions.

## Planning Your Spring Garden

Use winter's downtime to develop a comprehensive plan for spring:

- **Review last year's garden journal** to remember what worked well and what didn't.
- **Create detailed garden maps** for optimal plant placement and crop rotation.
- **Research new varieties** to try in the coming year, particularly those well-suited to your specific growing conditions.
- **Calculate planting dates** for starting seeds indoors and direct sowing based on your region's last frost date.

## Seed Starting

Late winter is the time to start many seeds indoors:

- **Create a calendar** for when each type of seed should be started based on your last frost date.
- **Gather supplies:** seed-starting mix, containers, labels, and a light source (sunlight or grow lights).
- **Start long-season vegetables** like tomatoes, peppers, and eggplants 6-8 weeks before your last frost date.
- **Provide bottom heat** with a seedling heat mat for faster germination of many varieties.

## Tool Maintenance and Organization

Ensure your tools are ready for spring use:

- **Clean and sharpen** pruners, shears, shovels, and other garden tools.
- **Oil wooden handles** to prevent splitting and cracking.
- **Organize your seed inventory,** discarding old seeds that are unlikely to germinate well.
- **Take inventory of supplies** like pots, trellises, and garden amendments so you can purchase what you need before the spring rush.

## Continuing Education

Expand your gardening knowledge during the winter months:

- **Read gardening books and magazines** for inspiration and practical advice.
- **Attend virtual or in-person gardening workshops** offered by extension services or garden centers.
- **Join online gardening communities** to share experiences and learn from other gardeners in your region.
- **Study specific techniques** you'd like to implement, such as vertical gardening, permaculture design, or organic pest management.

## Winter Garden Monitoring

Don't completely neglect your outdoor garden spaces:

- **Check winter protection** on perennials, shrubs, and young trees after storms.
- **Monitor stored bulbs, tubers, and corms** for signs of rot or desiccation.
- **Water evergreens** during periods of winter drought when the ground isn't frozen.
- **Observe winter wildlife** that visits your garden and consider adding features to support beneficial creatures.

## Conclusion

Winter offers gardeners a valuable opportunity to rest, reflect, and prepare while still enjoying the pleasures of growing plants indoors. By engaging in these winter gardening activities, you'll not only satisfy your gardening itch during the cold months but also set yourself up for greater success when spring arrives. Embrace this seasonal rhythm—winter's pause is an essential part of the gardening cycle.
      `,
      published: true,
      published_at: new Date().toISOString(),
      author_id: userId,
      featured_image: "https://images.unsplash.com/photo-1513273216459-54c26d5b976d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    },
    {
      title: "Organic Pest Control: Natural Methods for a Healthy Garden",
      slug: "organic-pest-control",
      excerpt: "Learn effective organic methods to manage garden pests while maintaining a healthy ecosystem without harmful chemicals.",
      content: `
# Organic Pest Control: Natural Methods for a Healthy Garden

In the quest for a thriving garden, dealing with pests is inevitable. However, conventional pesticides often come with significant drawbacks—they can harm beneficial insects, contaminate soil and water, and potentially affect human health. Organic pest control offers effective alternatives that work with nature rather than against it, helping you maintain a balanced garden ecosystem.

## Prevention: The First Line of Defense

The most effective pest management strategy begins before problems arise:

- **Choose resistant varieties:** Many plant varieties have been developed with natural resistance to common pests and diseases.
- **Practice crop rotation:** Avoid planting the same family of crops in the same location year after year to break pest cycles.
- **Time your planting:** Some pests are more prevalent at certain times. Adjust your planting schedule to avoid peak pest periods.
- **Maintain healthy soil:** Plants grown in nutrient-rich soil with proper pH are naturally more resistant to pests and diseases.
- **Practice good sanitation:** Remove diseased plants promptly and clean up garden debris that could harbor pests.

## Encouraging Beneficial Insects

Your garden naturally contains allies in pest management—beneficial insects that prey on garden pests:

- **Ladybugs** consume aphids, mites, and small insect eggs.
- **Lacewings** feed on aphids, thrips, mealybugs, and small caterpillars.
- **Parasitic wasps** lay eggs in or on pest insects, eventually killing them.
- **Ground beetles** eat slugs, snails, and soil-dwelling pests.

To attract these helpful insects:

- Plant diverse flowering plants that provide nectar and pollen.
- Include herbs like dill, fennel, and cilantro, which attract beneficial insects when they bloom.
- Provide shelter with perennial plants, ground covers, and even small brush piles.
- Avoid broad-spectrum insecticides that kill beneficial insects along with pests.

## Companion Planting

Strategic planting combinations can deter pests naturally:

- **Aromatic herbs** like basil, rosemary, and sage repel many insect pests.
- **Alliums** (onions, garlic, chives) deter aphids, Japanese beetles, and rabbits.
- **Marigolds** release compounds from their roots that repel nematodes and their strong scent confuses some insect pests.
- **Nasturtiums** attract aphids away from crops and serve as trap plants.

## Physical Barriers and Traps

Sometimes the simplest solutions are the most effective:

- **Row covers** protect plants from flying insects while allowing light, air, and water to penetrate.
- **Copper tape** creates a barrier that slugs and snails won't cross.
- **Sticky traps** capture flying insects like whiteflies and fungus gnats.
- **Diatomaceous earth** sprinkled around plants creates a barrier against soft-bodied insects like slugs.
- **Handpicking** larger pests like tomato hornworms and Japanese beetles can be surprisingly effective in small gardens.

## Organic Sprays and Solutions

When more direct intervention is necessary, these organic options are effective:

### Homemade Remedies

- **Insecticidal soap:** Mix 1 tablespoon of mild liquid soap (not detergent) with 1 quart of water. Effective against soft-bodied insects like aphids and mealybugs.
- **Garlic spray:** Blend garlic cloves with water, strain, and spray to repel many insects.
- **Neem oil:** Derived from the neem tree, this natural oil disrupts insect feeding and reproduction.
- **Hot pepper spray:** Capsaicin deters many insects and some mammals.

### Commercial Organic Products

- **Bacillus thuringiensis (Bt):** A bacteria that specifically targets caterpillars without harming other insects.
- **Spinosad:** Derived from soil bacteria, effective against caterpillars, thrips, and fruit flies.
- **Insecticidal soaps and horticultural oils:** Commercially formulated for maximum effectiveness and plant safety.

## Biological Controls

Introducing specific organisms to target particular pests:

- **Beneficial nematodes** control soil-dwelling pests like grubs and root-feeding larvae.
- **Bacillus thuringiensis israelensis (BTI)** targets mosquito and fungus gnat larvae in water.
- **Predatory mites** control pest mites and small insects.
- **Milky spore** attacks Japanese beetle grubs in the soil.

## Integrated Pest Management (IPM)

Rather than relying on any single method, IPM combines multiple strategies:

1. **Regular monitoring** to detect problems early.
2. **Identifying pests accurately** to choose the most effective controls.
3. **Setting action thresholds** to determine when intervention is necessary.
4. **Using the least toxic methods first** and escalating only as needed.
5. **Evaluating results** and adjusting strategies accordingly.

## Conclusion

Organic pest control requires more planning and observation than simply spraying chemicals, but the rewards are significant. You'll create a healthier environment for your plants, beneficial organisms, and yourself. Remember that some pest damage is normal in any garden—the goal isn't to eliminate all insects but to maintain balance so that pest populations remain below harmful levels. With patience and persistence, organic methods can effectively manage pests while preserving the ecological integrity of your garden.
      `,
      published: true,
      published_at: new Date().toISOString(),
      author_id: userId,
      featured_image: "https://images.unsplash.com/photo-1603912699214-92627f304eb6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1075&q=80"
    },
    {
      title: "Composting Basics: Turn Kitchen Waste into Garden Gold",
      slug: "composting-basics",
      excerpt: "Learn how to create nutrient-rich compost from kitchen scraps and yard waste to improve your garden soil naturally.",
      content: `
# Composting Basics: Turn Kitchen Waste into Garden Gold

Composting transforms ordinary kitchen scraps and yard waste into "black gold"—a nutrient-rich soil amendment that improves garden productivity while reducing landfill waste. This natural recycling process mimics nature's own decomposition cycle and creates a valuable resource for any gardener. Whether you have a large yard or a small apartment, there's a composting method that can work for you.

## Benefits of Composting

The advantages of composting extend beyond your garden:

- **Enriches soil** with nutrients and beneficial microorganisms
- **Improves soil structure**, allowing better water retention and drainage
- **Reduces waste** sent to landfills, where organic matter creates methane (a potent greenhouse gas)
- **Saves money** on commercial fertilizers and soil amendments
- **Closes the nutrient loop** by returning organic matter to the soil
- **Reduces the need** for chemical fertilizers

## What to Compost

The best compost piles contain a mix of "browns" (carbon-rich materials) and "greens" (nitrogen-rich materials):

### Browns (Carbon Sources)
- Dry leaves
- Straw or hay
- Shredded newspaper or cardboard
- Wood chips or sawdust (untreated wood only)
- Corn stalks and husks
- Pine needles (in limited quantities)
- Eggshells (rinsed and crushed)

### Greens (Nitrogen Sources)
- Fruit and vegetable scraps
- Coffee grounds and filters
- Tea bags (remove staples)
- Fresh grass clippings
- Plant trimmings (non-diseased)
- Manure from herbivores (horses, cows, rabbits, etc.)
- Seaweed (rinsed if from salt water)

Aim for a ratio of roughly 3 parts browns to 1 part greens by volume.

## What NOT to Compost

Some materials can cause problems in home compost systems:

- Meat, fish, or poultry scraps (attracts pests)
- Dairy products (attracts pests)
- Oils and fats (slow decomposition and attract pests)
- Pet waste from carnivores (may contain pathogens)
- Diseased plants (may spread disease)
- Weeds that have gone to seed (may sprout in garden)
- Pressure-treated wood or sawdust (contains toxic chemicals)
- Large branches (take too long to break down)
- Citrus peels and onions in large quantities (can kill beneficial worms)

## Composting Methods

Choose a method that fits your space and lifestyle:

### Traditional Compost Pile or Bin

Ideal for those with yard space:

1. **Create a pile or use a bin** at least 3 feet by 3 feet by 3 feet (the minimum size for generating sufficient heat).
2. **Layer browns and greens**, starting with a thick layer of browns at the bottom.
3. **Add water** as needed—the pile should be as moist as a wrung-out sponge.
4. **Turn the pile** every few weeks to aerate it and speed decomposition.
5. **Harvest finished compost** from the bottom when it's dark, crumbly, and has an earthy smell (typically 2-12 months, depending on conditions).

### Tumbler Composting

A cleaner, more contained option:

1. **Purchase or build a compost tumbler** that rotates for easy mixing.
2. **Add a balanced mix** of browns and greens.
3. **Turn the tumbler** every few days to aerate the contents.
4. **Wait 1-3 months** for the materials to break down (faster than traditional piles due to better aeration).

### Vermicomposting (Worm Composting)

Perfect for apartments or small spaces:

1. **Set up a worm bin** with bedding (shredded newspaper, cardboard, or coconut coir).
2. **Add red wiggler worms** (Eisenia fetida), which are different from regular earthworms.
3. **Feed the worms** vegetable scraps, coffee grounds, and other suitable materials in moderation.
4. **Harvest the castings** (worm manure) every 3-6 months, which are a nitrogen-rich soil amendment.

### Bokashi Composting

An anaerobic method that can handle meat and dairy:

1. **Place food scraps** (including meat and dairy) in a special bucket.
2. **Sprinkle with Bokashi bran** (wheat bran inoculated with beneficial microorganisms).
3. **Seal the bucket** to maintain anaerobic conditions.
4. **Drain liquid fertilizer** regularly from the spigot.
5. **Bury the fermented waste** in soil after 2 weeks to complete the process.

## Troubleshooting Common Problems

Even experienced composters encounter issues occasionally:

### Smelly Compost
- **Cause:** Too much nitrogen (greens), too wet, or poor aeration.
- **Solution:** Add more carbon materials (browns), turn the pile more frequently, or adjust moisture levels.

### Attracting Pests
- **Cause:** Improper materials (meat, oils) or food scraps too close to the surface.
- **Solution:** Avoid problematic materials and bury food scraps in the center of the pile.

### Slow Decomposition
- **Cause:** Too dry, pieces too large, or cold weather.
- **Solution:** Add water, chop materials into smaller pieces, or be patient during winter months.

### Too Wet
- **Cause:** Too much water, poor drainage, or too many wet greens.
- **Solution:** Add dry browns, turn more frequently, or cover the pile during heavy rain.

## Using Finished Compost

Once your compost is ready, there are many ways to use it:

- **Mix into garden soil** before planting (2-4 inches worked into the top 6-12 inches of soil)
- **Top-dress lawns** with a thin layer in spring or fall
- **Side-dress vegetables** during the growing season
- **Make compost tea** by steeping compost in water, then using the liquid as fertilizer
- **Add to potting soil** at about 25% by volume
- **Use as mulch** around trees and shrubs

## Conclusion

Composting connects us to the natural cycles of growth, death, and renewal that sustain all life. By diverting organic waste from landfills and creating a valuable soil amendment, composting is one of the most practical and impactful environmental actions an individual can take. Whether you're an experienced gardener or just starting out, incorporating composting into your routine will benefit both your plants and the planet.
      `,
      published: true,
      published_at: new Date().toISOString(),
      author_id: userId,
      featured_image: "https://images.unsplash.com/photo-1580412581060-8db4e049db71?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    }
  ];

  // Insert blog posts into database
  try {
    for (const post of blogPosts) {
      await supabase.from('blog_posts').insert(post);
    }
    console.log('Sample blog posts added successfully.');
  } catch (error) {
    console.error('Error adding sample blog posts:', error);
  }
};

export default seedBlogPosts;
