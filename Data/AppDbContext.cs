using Microsoft.EntityFrameworkCore;
using PawsAndRescueApi.Models;

namespace PawsAndRescueApi.Data;

public class AppDbContext : DbContext
{
  //constructorul
  public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

  //tabele 
  public DbSet<User> Users { get; set; }
  public DbSet<Dog> Dogs { get; set; }
  public DbSet<Shift> Shifts { get; set; }
  public DbSet<ShelterTask> Tasks { get; set; }

}