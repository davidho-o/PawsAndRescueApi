using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PawsAndRescueApi.Models;
using PawsAndRescueApi.Data;

namespace PawsAndRescueApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ShelterTasksController : ControllerBase
{
  // connection with the database
  private readonly AppDbContext _context;

  //constructor
  public ShelterTasksController(AppDbContext contextGiven)
  {
    _context = contextGiven;
  }

  // gets all the tasks from the database
  [HttpGet]
  public async Task<ActionResult<IEnumerable<ShelterTask>>> GetTasks()
  {
    return await _context.ShelterTasks.ToListAsync();
  }

  [HttpPost]
  public async Task<ActionResult<ShelterTask>> AddTask(ShelterTask taskGiven)
  {
    _context.ShelterTasks.Add(taskGiven);
    await _context.SaveChangesAsync();

    return Ok(taskGiven);
  }
}