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
                // Clear existing movies before reseeding
                context.Movies.RemoveRange(context.Movies);
                context.SaveChanges();

                // Reset identity (SQL Server example)
                context.Database.ExecuteSqlRaw("DBCC CHECKIDENT ('Movies', RESEED, 0)");

                // Add new list of movies
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
                    }
                );

                context.SaveChanges();
            }
        }
    }
}
