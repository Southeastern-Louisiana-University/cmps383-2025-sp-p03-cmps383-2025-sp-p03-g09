using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Movies;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/movies")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        private readonly DbSet<Movie> movies;
        private readonly DataContext dataContext;

        public MoviesController(DataContext dataContext)
        {
            this.dataContext = dataContext;
            movies = dataContext.Set<Movie>();
        }

        [HttpGet]
        public IQueryable<MovieDto> GetAllMovies()
        {
            return GetMovieDtos(movies);
        }

        [HttpGet]
        [Route("{id}")]
        public ActionResult<MovieDto> GetMovieById(int id)
        {
            var result = GetMovieDtos(movies.Where(x => x.Id == id)).FirstOrDefault();
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = UserRoleNames.Admin)]
        public ActionResult<MovieDto> CreateMovie(MovieDto dto)
        {
            if (IsInvalid(dto))
            {
                return BadRequest();
            }

            var movie = new Movie
            {
                Title = dto.Title,
                Duration = dto.Duration,
                Rating = dto.Rating,
                Description = dto.Description,
                ReleaseDate = dto.ReleaseDate
            };
            movies.Add(movie);

            dataContext.SaveChanges();

            dto.Id = movie.Id;

            return CreatedAtAction(nameof(GetMovieById), new { id = dto.Id }, dto);
        }

        [HttpPut]
        [Route("{id}")]
        [Authorize(Roles = UserRoleNames.Admin)]
        public ActionResult<MovieDto> UpdateMovie(int id, MovieDto dto)
        {
            if (IsInvalid(dto))
            {
                return BadRequest();
            }

            var movie = movies.FirstOrDefault(x => x.Id == id);
            if (movie == null)
            {
                return NotFound();
            }

            movie.Title = dto.Title;
            movie.Duration = dto.Duration;
            movie.Rating = dto.Rating;
            movie.Description = dto.Description;
            movie.ReleaseDate = dto.ReleaseDate;

            dataContext.SaveChanges();

            dto.Id = movie.Id;

            return Ok(dto);
        }

        [HttpDelete]
        [Route("{id}")]
        [Authorize(Roles = UserRoleNames.Admin)]
        public ActionResult DeleteMovie(int id)
        {
            var movie = movies.FirstOrDefault(x => x.Id == id);
            if (movie == null)
            {
                return NotFound();
            }

            movies.Remove(movie);

            dataContext.SaveChanges();

            return Ok();
        }

        private bool IsInvalid(MovieDto dto)
        {
            return string.IsNullOrWhiteSpace(dto.Title) ||
                   dto.Title.Length > 120 ||
                   dto.Duration <= 0 ||
                   string.IsNullOrWhiteSpace(dto.Rating) ||
                   string.IsNullOrWhiteSpace(dto.Description) ||
                   dto.ReleaseDate == default;
        }

        private static IQueryable<MovieDto> GetMovieDtos(IQueryable<Movie> movies)
        {
            return movies
                .Select(x => new MovieDto
                {
                    Id = x.Id,
                    Title = x.Title,
                    Duration = x.Duration,
                    Rating = x.Rating,
                    Description = x.Description,
                    ReleaseDate = x.ReleaseDate
                });
        }
    }
}
