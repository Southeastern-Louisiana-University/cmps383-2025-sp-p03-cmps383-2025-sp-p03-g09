using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Selu383.SP25.P03.Api.Migrations
{
    /// <inheritdoc />
    public partial class TheRealFinalShowtimeFixThatWorks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
{
    migrationBuilder.DropForeignKey(
        name: "FK_Tickets_Locations_LocationId",
        table: "Tickets");

    migrationBuilder.DropForeignKey(
        name: "FK_Tickets_Movies_MovieId",
        table: "Tickets");

    migrationBuilder.DropForeignKey(
        name: "FK_Tickets_Theaters_TheaterId",
        table: "Tickets");

    migrationBuilder.DropIndex(
        name: "IX_Tickets_LocationId",
        table: "Tickets");

    migrationBuilder.DropColumn(
        name: "LocationId",
        table: "Tickets");

    migrationBuilder.DropColumn(
        name: "Showtime",
        table: "Tickets");

    migrationBuilder.RenameColumn(
        name: "TheaterId",
        table: "Tickets",
        newName: "ShowtimeId");

    migrationBuilder.RenameIndex(
        name: "IX_Tickets_TheaterId",
        table: "Tickets",
        newName: "IX_Tickets_ShowtimeId");

    migrationBuilder.DropIndex(
    name: "IX_Tickets_MovieId",
    table: "Tickets");

migrationBuilder.DropColumn(
    name: "MovieId",
    table: "Tickets");

}


        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
{
    migrationBuilder.AddColumn<int>(
        name: "LocationId",
        table: "Tickets",
        type: "int",
        nullable: false,
        defaultValue: 0);

    migrationBuilder.AddColumn<string>(
        name: "Showtime",
        table: "Tickets",
        type: "nvarchar(max)",
        nullable: false,
        defaultValue: "");

    migrationBuilder.RenameColumn(
        name: "ShowtimeId",
        table: "Tickets",
        newName: "TheaterId");

    migrationBuilder.RenameIndex(
        name: "IX_Tickets_ShowtimeId",
        table: "Tickets",
        newName: "IX_Tickets_TheaterId");

    migrationBuilder.AddColumn<int>(
        name: "MovieId",
        table: "Tickets",
        type: "int",
        nullable: false,
        defaultValue: 0);
}

    }
}
