using Microsoft.EntityFrameworkCore;
using PawsAndRescueApi.Models;

namespace PawsAndRescueApi.Data;

public class AppDbContext : DbContext
{
  //constructor
  public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

  //tabels
  public DbSet<User> Users { get; set; }
  public DbSet<Dog> Dogs { get; set; }
  public DbSet<Shift> Shifts { get; set; }
  public DbSet<ShelterTask> ShelterTasks { get; set; }

}