using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ReactApp.Controllers
{
    public class HangmanController : Controller
    {
		private static string [] _words;
		private string _word;


		static HangmanController() {			
			_words = System.IO.File.ReadAllText(@"C:\PersonalProjects\WebApplication1\wwwroot\words.txt").Split(',');
		} 

		public ActionResult Index()
		{
			return View();
		}
		[Route("word")]
		[ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
		public ActionResult GetWord()
		{
			return Json( _words[new Random().Next(0, _words.Length)]);
		}


	}
}
