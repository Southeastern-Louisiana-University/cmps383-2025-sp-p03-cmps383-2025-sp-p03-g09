using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Selu383.SP25.P03.Api.Migrations
{
    /// <inheritdoc />
    public partial class ProperShowtime : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
{
    migrationBuilder.Sql(@"
        DELETE FROM Tickets
        WHERE ShowtimeId IS NULL
           OR ShowtimeId NOT IN (SELECT Id FROM Showtimes)
    ");

    migrationBuilder.Sql(@"
        ALTER TABLE Tickets
        ADD CONSTRAINT FK_Tickets_Showtimes_ShowtimeId
        FOREIGN KEY (ShowtimeId) REFERENCES Showtimes(Id)
        ON DELETE NO ACTION
    ");
}


        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
{
    migrationBuilder.Sql(@"
        ALTER TABLE Tickets
        DROP CONSTRAINT FK_Tickets_Showtimes_ShowtimeId
    ");
}

    }
}
