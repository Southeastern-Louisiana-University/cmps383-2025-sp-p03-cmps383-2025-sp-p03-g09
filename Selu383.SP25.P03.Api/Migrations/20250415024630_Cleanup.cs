using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Selu383.SP25.P03.Api.Migrations
{
    public partial class Cleanup : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_Showtimes_ShowtimeId",
                table: "Tickets");

            migrationBuilder.DropTable(
                name: "Showtimes");

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

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_LocationId",
                table: "Tickets",
                column: "LocationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_Locations_LocationId",
                table: "Tickets",
                column: "LocationId",
                principalTable: "Locations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_Movies_MovieId",
                table: "Tickets",
                column: "MovieId",
                principalTable: "Movies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_Theaters_TheaterId",
                table: "Tickets",
                column: "TheaterId",
                principalTable: "Theaters",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AlterColumn<int>(
                name: "MovieId",
                table: "Tickets",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateTable(
                name: "Showtimes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MovieId = table.Column<int>(type: "int", nullable: false),
                    TheaterId = table.Column<int>(type: "int", nullable: false),
                    StartTime = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Showtimes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Showtimes_Movies_MovieId",
                        column: x => x.MovieId,
                        principalTable: "Movies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Showtimes_Theaters_TheaterId",
                        column: x => x.TheaterId,
                        principalTable: "Theaters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Showtimes_MovieId",
                table: "Showtimes",
                column: "MovieId");

            migrationBuilder.CreateIndex(
                name: "IX_Showtimes_TheaterId",
                table: "Showtimes",
                column: "TheaterId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_Showtimes_ShowtimeId",
                table: "Tickets",
                column: "ShowtimeId",
                principalTable: "Showtimes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
