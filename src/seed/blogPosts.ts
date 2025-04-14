
import { faker } from "@faker-js/faker";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author_id: string;
  published: boolean;
  published_at: string;
  featured_image: string;
};

const createBlogPost = (): BlogPost => {
  const title = faker.lorem.sentence();
  const slug = title.toLowerCase().replace(/ /g, "-");
  const date = faker.date.past().toISOString();
  const featured_image = faker.image.urlLoremFlickr({ category: 'nature' });
  
  return {
    id: faker.string.uuid(),
    title: title,
    slug: slug,
    excerpt: faker.lorem.paragraph(),
    content: faker.lorem.paragraphs(5),
    author_id: faker.string.uuid(),
    published: true,
    published_at: date,
    featured_image: featured_image,
  };
};

// Renamed from blogPosts to sampleBlogPosts to avoid naming conflict
const sampleBlogPosts: BlogPost[] = Array.from({ length: 6 }, () => createBlogPost());

// Adding new blog posts about gardening topics
const additionalPosts = [
  {
    id: "7",
    title: "Seasonal Planting Guide: What to Plant and When",
    slug: "seasonal-planting-guide",
    excerpt: "Learn the best times to plant various vegetables, fruits, and flowers throughout the year to maximize your garden's productivity.",
    content: `
# Seasonal Planting Guide: What to Plant and When

Knowing when to plant various crops is essential for a successful garden. This guide will help you understand the optimal planting times for different plants throughout the seasons.

## Spring (March - May)

Spring is the perfect time to start many garden favorites as the soil warms and the threat of frost diminishes.

### Early Spring
- **Cool-season vegetables**: Peas, lettuce, spinach, radishes, carrots
- **Herbs**: Parsley, cilantro, dill
- **Flowers**: Pansies, sweet peas, snapdragons

### Late Spring
- **Warm-season vegetables**: Tomatoes, peppers, eggplants (after last frost)
- **Herbs**: Basil, rosemary, thyme
- **Flowers**: Marigolds, zinnias, cosmos

## Summer (June - August)

Summer is ideal for heat-loving plants and succession planting of quick-growing vegetables.

### Early Summer
- **Vegetables**: Corn, beans, cucumbers, summer squash
- **Herbs**: Oregano, sage, mint
- **Flowers**: Sunflowers, dahlias, gladiolus

### Late Summer
- **Fall crops**: Kale, collards, brussels sprouts
- **Root vegetables**: Beets, turnips, carrots (for fall harvest)
- **Herbs**: Second plantings of cilantro, dill

## Fall (September - November)

Fall gardening focuses on cool-season crops and preparations for the following spring.

### Early Fall
- **Vegetables**: Spinach, lettuce, arugula, radishes
- **Cover crops**: Clover, rye, vetch
- **Flowers**: Mums, asters, pansies

### Late Fall
- **Garlic and onions**: For harvest next year
- **Spring bulbs**: Tulips, daffodils, crocuses
- **Trees and shrubs**: Ideal planting time for establishment

## Winter (December - February)

Winter is planning time for most gardeners, though some growing can still happen.

### Indoor Activities
- **Seed starting**: Get a jump on spring crops
- **Microgreens**: Quick-growing indoor crop
- **Planning**: Garden design and seed ordering

### Outdoor (Mild Climates)
- **Winter vegetables**: Kale, brussels sprouts, certain lettuces
- **Dormant pruning**: Fruit trees and roses
- **Mulching**: Protecting perennial plants

Remember that these timeframes are general guidelines and should be adjusted based on your specific climate zone. Your local extension service can provide more precise planting dates for your area.

Happy gardening!
    `,
    author_id: "1",
    published: true,
    published_at: "2025-03-14T12:00:00Z",
    featured_image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
  },
  {
    id: "8",
    title: "Essential Plant Care Tips for Thriving Gardens",
    slug: "plant-care-tips",
    excerpt: "Master the fundamentals of plant care with these expert tips on watering, fertilizing, pruning, and pest management.",
    content: `
# Essential Plant Care Tips for Thriving Gardens

Proper plant care is the foundation of a beautiful and productive garden. This guide covers the essential aspects of keeping your plants healthy and thriving throughout the growing season.

## Watering Wisdom

Water is life for plants, but improper watering practices can do more harm than good.

### Basics of Proper Watering
- **Deep, infrequent watering**: Encourages deeper root growth
- **Morning watering**: Reduces evaporation and fungal disease
- **Water at the base**: Avoid wetting foliage when possible
- **Check soil moisture**: Insert your finger 1-2 inches into the soil; if it feels dry, it's time to water

### Signs of Watering Problems
- **Wilting**: Can indicate both under and overwatering
- **Yellow leaves**: Often a sign of overwatering
- **Brown leaf edges**: Typically indicates underwatering
- **Slow growth**: May suggest inconsistent watering

## Nutrition and Fertilizing

Plants, like people, need proper nutrition to thrive.

### Understanding Plant Nutrition
- **Macronutrients (NPK)**: Nitrogen (leaf growth), Phosphorus (roots and flowers), Potassium (overall health)
- **Micronutrients**: Iron, manganese, zinc, and others needed in smaller amounts
- **Soil pH**: Affects nutrient availability; most plants prefer 6.0-7.0

### Fertilizing Tips
- **Start with soil testing**: Know what your soil needs
- **Slow-release options**: Provide steady nutrition over time
- **Compost**: Improves soil structure while adding nutrients
- **Avoid over-fertilizing**: Can burn plants and cause excessive foliage at the expense of flowers/fruit

## Pruning Practices

Strategic cutting encourages better plant form and productivity.

### Why Prune?
- **Removes dead/diseased material**: Improves plant health
- **Increases air circulation**: Reduces disease pressure
- **Stimulates new growth**: Can increase flowering and fruiting
- **Controls size and shape**: Keeps plants within bounds

### Pruning Guidelines
- **Use clean, sharp tools**: Prevents disease spread
- **Know your plant's needs**: Some plants need specific pruning techniques
- **Timing matters**: Many flowering shrubs are pruned right after blooming
- **Remove no more than 1/3**: Avoid stressing the plant with excessive pruning

## Pest and Disease Management

Every garden faces challenges from unwanted visitors.

### Preventive Measures
- **Healthy soil**: Strong plants resist problems better
- **Proper spacing**: Allows airflow and reduces disease
- **Companion planting**: Certain plants naturally repel pests
- **Regular inspection**: Catch problems early when they're easier to manage

### Eco-friendly Solutions
- **Insecticidal soap**: For soft-bodied insects
- **Neem oil**: Natural pesticide and fungicide
- **Beneficial insects**: Ladybugs, lacewings, and predatory mites
- **Physical barriers**: Row covers, copper tape for slugs

By mastering these fundamentals of plant care, you'll be well on your way to a garden that's not just surviving, but truly thriving throughout the seasons.
    `,
    author_id: "1",
    published: true,
    published_at: "2025-03-20T12:00:00Z",
    featured_image: "https://images.unsplash.com/photo-1598900438156-4078e6043996?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
  },
  {
    id: "9",
    title: "Companion Planting: Harmony in the Garden",
    slug: "companion-planting",
    excerpt: "Discover the art of companion planting to naturally deter pests, improve pollination, and enhance the growth and flavor of your garden plants.",
    content: `
# Companion Planting: Harmony in the Garden

Companion planting is the practice of growing certain plants near each other for mutual benefit. This age-old gardening wisdom can help you create a more balanced, productive, and pest-resistant garden ecosystem.

## Benefits of Companion Planting

### Natural Pest Control
- **Aromatic plants**: Strong-smelling herbs like basil, rosemary, and mint repel many common pests
- **Trap crops**: Plants that attract pests away from your valuable crops
- **Insectary plants**: Flowers that attract beneficial insects that prey on garden pests

### Enhanced Growth and Flavor
- **Nitrogen fixers**: Legumes like beans and peas add nitrogen to the soil
- **Complementary nutrient needs**: Pairing plants with different nutritional requirements
- **Taste improvement**: Some companions can enhance the flavor of nearby plants

### Physical Benefits
- **Shade providers**: Taller plants provide cooling shade for heat-sensitive crops
- **Living mulch**: Low-growing plants that suppress weeds and retain soil moisture
- **Structural support**: Sturdy plants can provide natural trellising

## Classic Companion Planting Combinations

### The Three Sisters
Native Americans' perfect example of companion planting:
- **Corn**: Provides a natural pole for beans
- **Beans**: Fix nitrogen in the soil for corn and squash
- **Squash**: Large leaves shade the soil and suppress weeds

### Tomato Companions
- **Basil**: Repels flies and mosquitoes, improves flavor and growth
- **Marigolds**: Deter nematodes in the soil
- **Borage**: Attracts pollinators, deters tomato hornworms
- **Avoid planting near**: Potatoes, fennel, cabbage family

### Cabbage Family Protectors
- **Aromatic herbs**: Thyme, mint, rosemary deter cabbage moths
- **Nasturtiums**: Act as a trap crop for aphids
- **Onion family**: Garlic and onions repel many cabbage pests
- **Avoid planting near**: Strawberries, tomatoes

### Root Vegetable Partners
- **Lettuce**: Shallow-rooted, doesn't compete with deeper root vegetables
- **Chives and onions**: Deter pests with their strong scent
- **Chamomile**: Improves flavor of root crops
- **Avoid planting near**: Other root crops that compete for space

## Plants That Don't Get Along

Some plants actively inhibit the growth of others:

### Common Antagonistic Pairs
- **Fennel**: Generally hostile to most garden plants
- **Black walnut trees**: Produce juglone, toxic to many plants
- **Sunflowers**: Can have allelopathic effects (inhibit growth) on certain plants
- **Beans and onions**: Onion family plants stunt bean growth

## How to Start Companion Planting

### Planning Your Garden
- **Research**: Learn which of your favorite plants grow well together
- **Start small**: Try a few proven combinations before redesigning your whole garden
- **Observe**: Keep notes on what works in your specific conditions

### Beyond Plants: Animal Companions
- **Chickens**: Can help with pest control and provide fertilizer (when properly managed)
- **Beneficial insects**: Create habitat for pollinators, predatory insects, and decomposers
- **Toads and birds**: Natural pest controllers that can be attracted with the right habitat

Companion planting is as much art as science, and regional variations abound. The best approach is to experiment with traditional combinations while remaining observant of what works in your unique garden ecosystem.
    `,
    author_id: "1",
    published: true,
    published_at: "2025-03-28T12:00:00Z",
    featured_image: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
  },
  {
    id: "10",
    title: "Common Garden Pests and Natural Solutions",
    slug: "garden-pests-natural-solutions",
    excerpt: "Identify and manage common garden pests using natural, environmentally friendly methods that protect your plants and beneficial insects.",
    content: `
# Common Garden Pests and Natural Solutions

Every garden faces challenges from insect pests and other unwanted visitors. This guide will help you identify common garden pests and provide natural, environmentally friendly solutions to manage them effectively.

## Aphids

These tiny sap-suckers are among the most common garden pests.

### Identification
- **Appearance**: Small (1/8 inch), pear-shaped, soft-bodied insects in various colors
- **Behavior**: Cluster on new growth and undersides of leaves
- **Damage**: Stunted growth, curled leaves, sticky "honeydew" residue

### Natural Controls
- **Strong water spray**: Dislodge aphids with a forceful stream of water
- **Insecticidal soap**: Effective on contact with soft-bodied insects
- **Neem oil**: Disrupts feeding and reproduction
- **Beneficial insects**: Ladybugs, lacewings, and parasitic wasps are natural predators

## Tomato Hornworms

These large caterpillars can devour tomato plants with amazing speed.

### Identification
- **Appearance**: Large green caterpillars (up to 4 inches) with white stripes and a horn-like projection
- **Behavior**: Feed on leaves, stems, and occasionally fruits
- **Damage**: Defoliation, especially on upper portions of plants

### Natural Controls
- **Handpicking**: Most effective in small gardens
- **Bacillus thuringiensis (Bt)**: Natural bacteria that affects only caterpillars
- **Companion planting**: Dill attracts beneficial wasps that parasitize hornworms
- **Look for parasitized hornworms**: White cocoons on the caterpillar's back indicate parasitic wasp activity; leave these in the garden

## Japanese Beetles

These metallic beauties can skeletonize leaves in record time.

### Identification
- **Appearance**: Metallic green-copper beetles about 1/2 inch long
- **Behavior**: Feed in groups, starting at the top of plants
- **Damage**: Skeletonized leaves (only veins remain)

### Natural Controls
- **Handpicking**: Drop into soapy water in early morning when they're sluggish
- **Row covers**: Physical exclusion during peak season
- **Milky spore**: Biological control that affects the soil-dwelling grub stage
- **Companion plants**: Garlic, rue, and tansy may repel them

## Squash Bugs

These persistent pests target cucurbits (squash, pumpkins, cucumbers).

### Identification
- **Appearance**: Gray-brown, flat-backed bugs about 5/8 inch long
- **Behavior**: Congregate at plant bases and under leaves
- **Damage**: Wilting, yellow spots that turn brown, eventual plant death

### Natural Controls
- **Vigilant monitoring**: Check under leaves for egg clusters and crush them
- **Diatomaceous earth**: Apply around plant bases
- **Trap boards**: Place boards near plants; bugs collect underneath in the morning and can be destroyed
- **Neem oil**: Apply to nymphs (immature stages)

## Slugs and Snails

These nocturnal mollusks can devastate seedlings and leafy greens.

### Identification
- **Appearance**: Soft-bodied mollusks with or without shells
- **Behavior**: Active at night and on cloudy, damp days
- **Damage**: Large, irregular holes in leaves; slime trails

### Natural Controls
- **Beer traps**: Shallow containers of beer sunk into the ground
- **Copper barriers**: Create an unpleasant reaction when slugs and snails contact copper
- **Diatomaceous earth**: Creates a sharp barrier they won't cross
- **Iron phosphate baits**: Safe around pets and wildlife, unlike metaldehyde baits

## Cabbage Loopers and Cabbage Worms

These caterpillars target members of the cabbage family.

### Identification
- **Appearance**: Green caterpillars; loopers move in an inchworm fashion
- **Behavior**: Feed on the undersides of leaves
- **Damage**: Holes in leaves, contamination with frass (droppings)

### Natural Controls
- **Row covers**: Physical exclusion of the adult moths
- **Bacillus thuringiensis (Bt)**: Effective biological control
- **Companion planting**: Thyme, rosemary, sage deter the adult moths
- **Paper collar barriers**: Prevent cutworm damage on young plants

## Integrated Pest Management Approach

Rather than reaching for sprays at the first sign of damage, consider these broader strategies:

### Prevention
- **Healthy soil**: Produces stronger, more pest-resistant plants
- **Proper plant spacing**: Improves air circulation and reduces disease
- **Crop rotation**: Disrupts pest life cycles
- **Season-appropriate planting**: Plants stressed by weather are more vulnerable to pests

### Monitoring
- **Regular inspection**: Check plants weekly, preferably in early morning
- **Understand threshold levels**: Some damage is acceptable and doesn't warrant intervention
- **Identify correctly**: Make sure you know what's causing the damage before treating

### Intervention Hierarchy
1. **Physical controls**: Handpicking, barriers, traps
2. **Biological controls**: Beneficial insects, nematodes, microbial products
3. **Least-toxic chemical controls**: Soaps, oils, botanical insecticides
4. **Synthetic chemicals**: As a last resort, and used with great care

Remember that a healthy garden ecosystem includes some pest presence, which supports beneficial predators. Perfect, pest-free plants are neither realistic nor ecologically sound as a goal.
    `,
    author_id: "1",
    published: true,
    published_at: "2025-04-02T12:00:00Z",
    featured_image: "https://images.unsplash.com/photo-1599583863916-e06c29087f51?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
  },
  {
    id: "11",
    title: "Organic Gardening Methods: Growing Naturally",
    slug: "organic-gardening-methods",
    excerpt: "Discover the principles and practices of organic gardening that promote soil health, biodiversity, and sustainable food production.",
    content: `
# Organic Gardening Methods: Growing Naturally

Organic gardening works with nature rather than against it, focusing on building healthy soil that produces strong plants naturally resistant to pests and diseases. This guide covers the fundamental principles and practices of organic gardening.

## The Foundation: Soil Health

The cornerstone of organic gardening is creating living, nutrient-rich soil.

### Building Organic Matter
- **Compost**: The organic gardener's gold, providing nutrients and beneficial microorganisms
- **Mulch**: Protects soil, suppresses weeds, and breaks down to add organic matter
- **Cover crops**: Prevent erosion, fix nitrogen, and add biomass when turned into the soil

### Soil Organisms
- **Earthworms**: Nature's tillers that aerate soil and leave behind nutrient-rich castings
- **Microorganisms**: Break down organic matter into plant-available nutrients
- **Mycorrhizal fungi**: Form symbiotic relationships with plant roots, extending their reach

### Natural Amendments
- **Compost tea**: Liquid fertilizer and beneficial microbe inoculant
- **Seaweed**: Provides trace minerals and growth hormones
- **Rock dust**: Slowly releases minerals, restoring depleted soils
- **Wood ash**: Adds potassium and increases pH (use sparingly)

## Organic Pest Management

Working with nature's systems to manage pests without synthetic chemicals.

### Cultural Practices
- **Crop rotation**: Disrupts pest life cycles by changing what's planted where
- **Polyculture**: Mixed plantings confuse pests and reduce disease spread
- **Timing**: Planting to avoid peak pest periods
- **Resistant varieties**: Choosing plants bred or selected for pest resistance

### Biological Controls
- **Beneficial insects**: Ladybugs, lacewings, parasitic wasps, and more
- **Birds**: Creating habitat for insect-eating birds
- **Toads and frogs**: Natural pest controllers in the garden
- **Beneficial nematodes**: Microscopic organisms that prey on soil-dwelling pests

### Organic Sprays and Treatments
- **Garlic-pepper spray**: Homemade deterrent for many insects
- **Bacillus thuringiensis (Bt)**: Bacteria that target caterpillars
- **Diatomaceous earth**: Microscopic fossils that slice insect exoskeletons
- **Horticultural oils**: Smother soft-bodied insects and some eggs

## Water Conservation

Responsible water use is integral to sustainable organic gardening.

### Efficient Watering Methods
- **Drip irrigation**: Delivers water directly to plant roots with minimal waste
- **Ollas**: Buried clay pots that slowly release water to roots
- **Deep, infrequent watering**: Encourages deep root growth
- **Morning watering**: Reduces evaporation loss

### Water Capture and Storage
- **Rain barrels**: Collect roof runoff for garden use
- **Swales**: Contoured ditches that slow and capture surface water
- **Berms**: Raised areas that direct and contain water flow
- **Mulch**: Reduces evaporation from soil surface

## Organic Weed Management

Controlling unwanted plants without herbicides.

### Prevention
- **Mulch**: Physical barrier to weed germination
- **Close spacing**: Plants shade out potential weeds
- **Cover crops**: Occupy bare soil where weeds would grow
- **Landscape fabric**: Durable barrier for paths and permanent areas

### Removal
- **Hand-pulling**: Most effective when soil is moist
- **Hoeing**: Regular shallow cultivation for young weed seedlings
- **Flame weeding**: Using propane torches to kill young weeds
- **Boiling water**: Effective on walkway and path weeds

## Seed Saving and Heritage Varieties

Preserving biodiversity and adapting plants to your local conditions.

### Benefits of Seed Saving
- **Adaptation**: Plants become better suited to your specific growing conditions
- **Cost savings**: Reduce or eliminate seed purchases
- **Food security**: Control over your food supply
- **Preservation**: Maintain genetic diversity of food crops

### Basic Seed Saving Techniques
- **Selection**: Choose the best plants for seed saving
- **Isolation**: Prevent cross-pollination for true-to-type seeds
- **Processing**: Proper cleaning and drying methods
- **Storage**: Cool, dark, and dry conditions for maximum viability

## The Organic Mindset

Beyond techniques, organic gardening involves a philosophical approach.

### Working With Nature
- **Observation**: Spending time watching what happens in your garden
- **Integration**: Seeing your garden as part of the broader ecosystem
- **Patience**: Understanding that natural systems take time to establish
- **Acceptance**: Some pest damage is part of a balanced system

### Continuous Learning
- **Record-keeping**: Taking notes on what works and what doesn't
- **Community connections**: Sharing knowledge with other gardeners
- **Seasonal awareness**: Aligning activities with natural cycles
- **Experimentation**: Trying new methods on a small scale

Organic gardening isn't just about avoiding chemicals; it's about fostering a thriving ecosystem where plants, animals, insects, and microorganisms work together to create abundance and beauty. By working with natural systems rather than against them, organic gardeners create resilient, productive spaces that improve over time.
    `,
    author_id: "1",
    published: true,
    published_at: "2025-04-10T12:00:00Z",
    featured_image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80"
  }
];

// Now export the combined array as blogPosts
export const blogPosts = [
  ...sampleBlogPosts,
  ...additionalPosts
];
