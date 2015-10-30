using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using EnergyNetwork.Domain.Model;
using EnergyNetwork.Domain.UnitOfWork;
using EnergyNetwork.Web.Helpers;
using EnergyNetwork.Web.Results;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;

namespace EnergyNetwork.Web.Controllers
{
    [Authorize(Roles = "Administrator,User")]
    public class FileController : Controller
    {
        private ApplicationUserManager _userManager;
        private readonly IUnitOfWork _unitOfWork;

        public FileController(IUnitOfWork unitOfWork)
        {
          _unitOfWork = unitOfWork;
        }

        public ApplicationUserManager UserManager
        {
          get
          {
            return _userManager ?? System.Web.HttpContext.Current.GetOwinContext().
              GetUserManager<ApplicationUserManager>();
          }
          private set
          {
            _userManager = value;
          }
        }

        [HttpPost]
        [Route("saveFile")]
        public string SaveFile()
        {
          var httpPostedFile = System.Web.HttpContext.Current.Request.Files["file"];

          byte[] fileData = null;
          using (var binaryReader = new BinaryReader(httpPostedFile.InputStream))
          {
            fileData = binaryReader.ReadBytes(httpPostedFile.ContentLength);
          }

          var documentContent = new DocumentContent
          {
            DocumentContentId = Guid.NewGuid(),
            ContentType = httpPostedFile.ContentType,
            Content = fileData
          };

          _unitOfWork.DocumentContentRepository.Add(documentContent);
          _unitOfWork.Commit();

          return documentContent.DocumentContentId.ToString();
        }

        [HttpGet]
        [Route("removeFile")]
        public void RemoveFile(string id)
        {
          Guid contentId = Guid.Parse(id);
          DocumentContent content = _unitOfWork.DocumentContentRepository.GetById(contentId);

          _unitOfWork.DocumentContentRepository.Delete(content);
        }

        [HttpGet]
        [Route("getFileBy")]
        public HttpResponse GetFileBy(string id)
        {
          Guid contentId = Guid.Parse(id);
          DocumentContent content = _unitOfWork.DocumentContentRepository.GetById(contentId);
          Document document =
            _unitOfWork.DocumentRepository.Find(d => d.DocumentContentId == content.DocumentContentId.ToString()).First();

          HttpResponse response = System.Web.HttpContext.Current.Response;
          response.Clear();
          response.ContentType = content.ContentType;
          response.AddHeader("content-disposition",
            "attachment;filename=\"" + document.FileName + "\"");

          response.BinaryWrite(content.Content);

          response.End();
          return response;
        }
    
    }
}