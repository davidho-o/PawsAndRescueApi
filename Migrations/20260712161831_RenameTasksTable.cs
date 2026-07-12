using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PawsAndRescueApi.Migrations
{
    /// <inheritdoc />
    public partial class RenameTasksTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Tasks",
                table: "Tasks");

            migrationBuilder.RenameTable(
                name: "Tasks",
                newName: "ShelterTasks");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ShelterTasks",
                table: "ShelterTasks",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_ShelterTasks",
                table: "ShelterTasks");

            migrationBuilder.RenameTable(
                name: "ShelterTasks",
                newName: "Tasks");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Tasks",
                table: "Tasks",
                column: "Id");
        }
    }
}
