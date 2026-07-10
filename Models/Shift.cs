namespace PawsAndRescueApi.Models;


public class Shift
{
  public int Id { get; set; }

  public DateTime Date { get; set; }

  //info about the beginning of the shift and it's ending
  public string HourBegin { get; set; } = string.Empty;
  public string HourEnd { get; set; } = string.Empty;

  //the main volunteer that is in charge of this shift;
  public int VolunteerId { get; set; }

  //optional: the second volunteer that can cover up the first one
  public int? BackupVolunteerId { get; set; }

  //manager approves the shift
  public bool IsApproved { get; set; } = false;
}