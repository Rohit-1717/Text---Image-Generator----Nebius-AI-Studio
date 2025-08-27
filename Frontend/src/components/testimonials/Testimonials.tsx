import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

type Testimonial = {
  name: string;
  role: string;
  image: string;
  quote: string;
};

// Update testimonials for your website
const testimonials: Testimonial[] = [
  {
    name: "Alice Johnson",
    role: "Digital Artist",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    quote:
      "Morphix has completely transformed the way I create AI-generated images. It’s fast, intuitive, and so much fun!",
  },
  {
    name: "Rajesh Kumar",
    role: "UI/UX Designer",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    quote:
      "A seamless platform for generating stunning visuals from multiple AI models. Morphix makes creativity effortless.",
  },
  {
    name: "Aarav Mehta",
    role: "Graphic Designer",
    image: "https://randomuser.me/api/portraits/men/21.jpg",
    quote:
      "Morphix has revolutionized the way I create digital art. The AI-generated images are stunning and inspire new ideas every day.",
  },
  {
    name: "Ishita Kapoor",
    role: "Frontend Developer",
    image: "https://randomuser.me/api/portraits/women/22.jpg",
    quote:
      "With Morphix, I can quickly generate visuals for my projects without spending hours on design. Truly a time-saver!",
  },
  {
    name: "Vikram Singh",
    role: "Content Creator",
    image: "https://randomuser.me/api/portraits/men/23.jpg",
    quote:
      "Morphix is my go-to platform for AI image generation. It’s simple, efficient, and produces professional-quality results.",
  },

  {
    name: "Sophia Lee",
    role: "Creative Director",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    quote:
      "The variety of AI models available on Morphix is incredible. I can create unique images for every project with ease.",
  },
  {
    name: "Daniel Kim",
    role: "Freelance Illustrator",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    quote:
      "I love Morphix! Generating professional-quality images has never been easier. It saves me so much time.",
  },
  {
    name: "Emily Wong",
    role: "Content Creator",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    quote:
      "Morphix is a game-changer for anyone who needs fast and creative AI-generated images for projects.",
  },
  {
    name: "Mohammed Ali",
    role: "Startup Founder",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
    quote:
      "From concept to creation, Morphix helps me bring my visual ideas to life with minimal effort.",
  },
];

const chunkArray = (
  array: Testimonial[],
  chunkSize: number
): Testimonial[][] => {
  const result: Testimonial[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

const testimonialChunks = chunkArray(
  testimonials,
  Math.ceil(testimonials.length / 3)
);

export default function WallOfLoveSection() {
  return (
    <section>
      <div className="py-16 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-semibold">Loved by the Community</h2>
            <p className="mt-6">
              See how creators and professionals are using Morphix to generate
              stunning AI images effortlessly.
            </p>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 md:mt-12 lg:grid-cols-3">
            {testimonialChunks.map((chunk, chunkIndex) => (
              <div key={chunkIndex} className="space-y-3">
                {chunk.map(({ name, role, quote, image }, index) => (
                  <Card key={index}>
                    <CardContent className="grid grid-cols-[auto_1fr] gap-3 pt-6">
                      <Avatar className="size-9">
                        <AvatarImage
                          alt={name}
                          src={image}
                          loading="lazy"
                          width="120"
                          height="120"
                        />
                        <AvatarFallback>ST</AvatarFallback>
                      </Avatar>

                      <div>
                        <h3 className="font-medium">{name}</h3>
                        <span className="text-muted-foreground block text-sm tracking-wide">
                          {role}
                        </span>
                        <blockquote className="mt-3">
                          <p className="text-gray-700 dark:text-gray-300">
                            {quote}
                          </p>
                        </blockquote>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
