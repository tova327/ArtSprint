using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class fixCompetionPaintingModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "CompetitionPaintings",
                newName: "JoinedAt");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "CompetitionPaintings",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Id",
                table: "CompetitionPaintings");

            migrationBuilder.RenameColumn(
                name: "JoinedAt",
                table: "CompetitionPaintings",
                newName: "CreatedAt");
        }
    }
}
