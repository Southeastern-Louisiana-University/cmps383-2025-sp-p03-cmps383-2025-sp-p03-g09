using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Movies;

namespace Selu383.SP25.P03.Api.Data
{
    public static class SeedMovies
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new DataContext(serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()))
            {
                context.Movies.RemoveRange(context.Movies);
                context.SaveChanges();

                context.Database.ExecuteSqlRaw("DBCC CHECKIDENT ('Movies', RESEED, 0)");

                context.Movies.AddRange(
                    new Movie
                    {
                        Title = "Captain America: Brave New World",
                        Duration = 119,
                        Rating = "PG-13",
                        Description = "A thief who steals corporate secrets through dream-sharing technology. After meeting with newly elected U.S. President Thaddeus Ross, Sam finds himself in the middle of an international incident...",
                        ReleaseDate = new DateTime(2025, 2, 14),
                        PosterUrl = "https://i.imgur.com/kpvUnbB.jpeg",
                        YoutubeUrl = "https://www.youtube.com/watch?v=5PSzFLV-EyQ"
                    },
                    new Movie
                    {
                        Title = "Novocaine",
                        Duration = 109,
                        Rating = "R",
                        Description = "When the girl of his dreams is kidnapped, everyman Nate turns his inability to feel pain into an unexpected strength in his fight to get her back.",
                        ReleaseDate = new DateTime(2025, 3, 14),
                        PosterUrl = "https://i.imgur.com/lvhe19y.jpeg",
                        YoutubeUrl = "https://www.youtube.com/watch?v=99BLnkAlC1M"
                    },
                    new Movie
                    {
                        Title = "Snow White",
                        Duration = 109,
                        Rating = "PG",
                        Description = "Princess Snow White flees the castle when the Evil Queen, in her jealousy over Snow White's inner beauty, tries to kill her...",
                        ReleaseDate = new DateTime(2025, 3, 21),
                        PosterUrl = "https://i.imgur.com/xCNOH4U.jpeg",
                        YoutubeUrl = "https://www.youtube.com/watch?v=KsSoo5K8CpA"
                    },
                    new Movie
                    {
                        Title = "A Minecraft Movie",
                        Duration = 100,
                        Rating = "PG",
                        Description = "Four misfits find themselves struggling with ordinary problems when they are suddenly pulled through a mysterious portal into the Overworld: a bizarre, cubic wonderland that thrives on imagination. To get back home, they'll have to master this world while embarking on a magical quest with an unexpected, expert crafter, Steve.",
                        ReleaseDate = new DateTime(2025, 4, 4),
                        PosterUrl = "https://i.imgur.com/CtiItHl.jpeg",
                        YoutubeUrl = "https://www.youtube.com/watch?v=8B1EtVPBSMw"
                    },
                    new Movie
                    {
                        Title = "The Amateur",
                        Duration = 123,
                        Rating = "PG-13",
                        Description = "After his life is turned upside down when his wife is killed in a London terrorist attack, a brilliant but introverted CIA decoder takes matters into his own hands when his supervisors refuse to take action.",
                        ReleaseDate = new DateTime(2025, 4, 11),
                        PosterUrl = "https://i.imgur.com/82JHVqU.jpeg",
                        YoutubeUrl = "https://www.youtube.com/watch?v=DCWcK4c-F8Q"
                    },
                    new Movie
                    {
                        Title = "A Working Man",
                        Duration = 116,
                        Rating = "R",
                        Description = "Levon Cade left behind a decorated military career in the black ops to live a simple life working construction. But when his boss's daughter, who is like family to him, is taken by human traffickers, his search to bring her home uncovers a world of corruption far greater than he ever could have imagined.",
                        ReleaseDate = new DateTime(2025, 3, 28),
                        PosterUrl = "https://i.imgur.com/oPNz3zp.jpeg",
                        YoutubeUrl = "https://www.youtube.com/watch?v=mdfrG2cLK58"
                    },
                    new Movie
                    {
                        Title = "The King of Kings",
                        Duration = 104,
                        Rating = "PG",
                        Description = "A father tells his son the greatest story ever told, and what begins as a bedtime tale becomes a life-changing journey. Through vivid imagination, the boy walks alongside Jesus, witnessing His miracles, facing His trials, and understanding His ultimate sacrifice. The King of Kings invites us to rediscover the enduring power of hope, love, and redemption through the eyes of a child.",
                        ReleaseDate = new DateTime(2025, 4, 11),
                        PosterUrl = "https://i.imgur.com/hvZ9Aql.jpeg",
                        YoutubeUrl = "https://www.youtube.com/watch?v=HkGZ4ykhYPg"
                    },
                    new Movie
                    {
                        Title = "Death of a Unicorn",
                        Duration = 107,
                        Rating = "R",
                        Description = "A father and daughter accidentally hit and kill a unicorn while en route to a weekend retreat, where his billionaire boss seeks to exploit the creature’s miraculous curative properties.",
                        ReleaseDate = new DateTime(2025, 3, 28),
                        PosterUrl = "https://i.imgur.com/EYeLcGS.jpeg",
                        YoutubeUrl = "https://www.youtube.com/watch?v=aQOle3MHnGs"
                    },
                    new Movie
                    {
                        Title = "Sacramento",
                        Duration = 89,
                        Rating = "R",
                        Description = "When free-spirited Ricky suddenly reappears in father-to-be Glenn’s life, the two former best friends embark on a spontaneous road trip from LA to Sacramento.",
                        ReleaseDate = new DateTime(2025, 4, 11),
                        PosterUrl = "https://i.imgur.com/6V0N9Rg.jpeg",
                        YoutubeUrl = "https://www.youtube.com/watch?v=jZRbFs_WhX0"
                    },
                    new Movie
                    {
                        Title = "The Friend",
                        Duration = 120,
                        Rating = "R",
                        Description = "Writer and teacher Iris finds her comfortable, solitary New York life thrown into disarray after her closest friend and mentor bequeaths her his beloved 150 lb. Great Dane. The regal yet intractable beast, named Apollo, immediately creates practical problems for Iris, from furniture destruction to eviction notices, as well as more existential ones. Yet as Iris finds herself unexpectedly bonding with Apollo, she begins to come to terms with her past, and her own creative inner life in this story of healing, love, and friendship.",
                        ReleaseDate = new DateTime(2025, 3, 28),
                        PosterUrl = "https://i.imgur.com/HXDE59T.jpeg",
                        YoutubeUrl = "https://www.youtube.com/watch?v=K2Df2g0Gl6o"
                    },
                    new Movie
                    {
                        Title = "Thunderbolts*",
                        Duration = 127,
                        Rating = "PG-13",
                        Description = "After finding themselves ensnared in a death trap, seven disillusioned castoffs must embark on a dangerous mission that will force them to confront the darkest corners of their pasts.",
                        ReleaseDate = new DateTime(2025, 5, 2),
                        PosterUrl = "https://i.imgur.com/1NfJH2h.jpeg",
                        YoutubeUrl = "https://www.youtube.com/watch?v=-sAOWhvheK8"
                    },
                    new Movie
                    {
                        Title = "The Surfer",
                        Duration = 100,
                        Rating = "R",
                        Description = "A man returns to the idyllic beach of his childhood to surf with his son. But his desire to hit the waves is thwarted by a group of locals whose mantra is 'don't live here, don't surf here.' Humiliated and angry, the man is drawn into a conflict that keeps rising in concert with the punishing heat of the summer and pushes him to his breaking point.",
                        ReleaseDate = new DateTime(2025, 5, 2),
                        PosterUrl = "https://i.imgur.com/UgsS6bZ.jpeg",
                        YoutubeUrl = "https://www.youtube.com/watch?v=A7Bo6cyfWho"
                    },
                    new Movie
                    {
                        Title = "Clown in a Cornfield",
                        Duration = 96,
                        Rating = "R",
                        Description = "Quinn and her father have just moved to the quiet town of Kettle Springs hoping for a fresh start. Instead, she discovers a fractured community that has fallen on hard times after the treasured Baypen Corn Syrup Factory burned down. As the locals bicker amongst themselves and tensions boil over, a sinister, grinning figure emerges from the cornfields to cleanse the town of its burdens, one bloody victim at a time.",
                        ReleaseDate = new DateTime(2025, 5, 9),
                        PosterUrl = "https://i.imgur.com/U28yIHf.jpeg",
                        YoutubeUrl = "https://www.youtube.com/watch?v=e69AWLED77w"
                    },
                    new Movie
                    {
                        Title = "Fight or Flight",
                        Duration = 101,
                        Rating = "R",
                        Description = "A mercenary takes on the job of tracking down a target on a plane but must protect her when they're surrounded by people trying to kill both of them.",
                        ReleaseDate = new DateTime(2025, 5, 9),
                        PosterUrl = "https://i.imgur.com/bRlyqRA.jpeg",
                        YoutubeUrl = "https://www.youtube.com/watch?v=SdsHRpjfqEI"
                    },
                    new Movie
                    {
                        Title = "Shadow Force",
                        Duration = 104,
                        Rating = "R",
                        Description = "Kyrah and Isaac were once the leaders of a multinational special forces group called Shadow Force. They broke the rules by falling in love, and in order to protect their son, they go underground. With a large bounty on their heads, and the vengeful Shadow Force hot on their trail, one family's fight becomes all-out war.",
                        ReleaseDate = new DateTime(2025, 5, 9),
                        PosterUrl = "https://i.imgur.com/h61baCw.jpeg",
                        YoutubeUrl = "https://www.youtube.com/watch?v=M7LhGytiHFM"
                    }
                    
                );

                context.SaveChanges();
            }
        }
    }
}
