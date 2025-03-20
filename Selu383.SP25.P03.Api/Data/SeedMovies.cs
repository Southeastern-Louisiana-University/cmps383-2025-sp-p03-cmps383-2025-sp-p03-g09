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
                // Look for any movies.
                if (context.Movies.Any())
                {
                    return; // DB has been seeded
                }

                context.Movies.AddRange(
                    new Movie
                    {
                        Title = "Inception",
                        Duration = 148,
                        Rating = "PG-13",
                        Description = "A thief who steals corporate secrets through dream-sharing technology.",
                        ReleaseDate = new DateTime(2010, 7, 16)
                    },
                    new Movie
                    {
                        Title = "The Dark Knight",
                        Duration = 152,
                        Rating = "PG-13",
                        Description = "Batman faces the Joker in Gotham City.",
                        ReleaseDate = new DateTime(2008, 7, 18)
                    },
                    new Movie
                    {
                        Title = "Interstellar",
                        Duration = 169,
                        Rating = "PG-13",
                        Description = "A team of explorers travels through a wormhole in space.",
                        ReleaseDate = new DateTime(2014, 11, 7)
                    }
                );

                context.SaveChanges();
            }
        }
    }
}
