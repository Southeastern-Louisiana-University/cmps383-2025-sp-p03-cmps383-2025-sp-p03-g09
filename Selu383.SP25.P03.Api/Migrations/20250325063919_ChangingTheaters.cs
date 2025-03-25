using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Selu383.SP25.P03.Api.Migrations
{
    /// <inheritdoc />
    public partial class ChangingTheaters : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Theaters_AspNetUsers_ManagerId",
                table: "Theaters");

            migrationBuilder.DropForeignKey(
                name: "FK_Theaters_Locations_LocationId",
                table: "Theaters");

            migrationBuilder.DropIndex(
                name: "IX_Theaters_ManagerId",
                table: "Theaters");

            migrationBuilder.DropColumn(
                name: "Address",
                table: "Theaters");

            migrationBuilder.DropColumn(
                name: "ManagerId",
                table: "Theaters");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Theaters");

            migrationBuilder.AlterColumn<int>(
                name: "LocationId",
                table: "Theaters",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TheaterNumber",
                table: "Theaters",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_Theaters_Locations_LocationId",
                table: "Theaters",
                column: "LocationId",
                principalTable: "Locations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Theaters_Locations_LocationId",
                table: "Theaters");

            migrationBuilder.DropColumn(
                name: "TheaterNumber",
                table: "Theaters");

            migrationBuilder.AlterColumn<int>(
                name: "LocationId",
                table: "Theaters",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Theaters",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "ManagerId",
                table: "Theaters",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Theaters",
                type: "nvarchar(120)",
                maxLength: 120,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Theaters_ManagerId",
                table: "Theaters",
                column: "ManagerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Theaters_AspNetUsers_ManagerId",
                table: "Theaters",
                column: "ManagerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Theaters_Locations_LocationId",
                table: "Theaters",
                column: "LocationId",
                principalTable: "Locations",
                principalColumn: "Id");
        }
    }
}
