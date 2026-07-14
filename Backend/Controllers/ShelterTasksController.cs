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
  public async Task<ActionResult<IEnumerable<ShelterTask>>> GetShelterTasks()
  {
    return await _context.ShelterTasks.ToListAsync();
  }

  // adds a task
  [HttpPost]
  public async Task<ActionResult<ShelterTask>> AddShelterTask(ShelterTask taskGiven)
  {
    _context.ShelterTasks.Add(taskGiven);
    await _context.SaveChangesAsync();

    return Ok(taskGiven);
  }

  //modifies a given task
  [HttpPut("{id}")]
  public async Task<IActionResult> UpdateShelterTask(int id, ShelterTask shelterTaskGiven)
  {
    if (id != shelterTaskGiven.Id)
    {
      return BadRequest();
    }

    _context.Entry(shelterTaskGiven).State = EntityState.Modified;

    try
    {
      await _context.SaveChangesAsync();
    }
    catch (DbUpdateConcurrencyException)
    {
      if (!_context.ShelterTasks.Any(t => t.Id == id))
      {
        return NotFound();
      }
      throw;
    }
    return NoContent();
  }

  //deletes a task with given id
  [HttpDelete("{id}")]
  public async Task<IActionResult> DeleteShelterTask(int id)
  {
    var task = await _context.ShelterTasks.FindAsync(id);

    if (task == null)
    {
      return NotFound();
    }

    _context.ShelterTasks.Remove(task);
    await _context.SaveChangesAsync();

    return NoContent();
  }
}