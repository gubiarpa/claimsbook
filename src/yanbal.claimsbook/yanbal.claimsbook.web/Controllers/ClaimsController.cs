﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using yanbal.claimsbook.data.Models;
using yanbal.claimsbook.data.Utils;
using yanbal.claimsbook.repository;
using yanbal.claimsbook.web.Models;

namespace yanbal.claimsbook.web.Controllers
{
    public class ClaimsController : Controller
    {
        protected readonly DBContextApp _context;

        public ClaimsController(DBContextApp context)
        {
            _context = context;
        }

        public IActionResult Index()
        {           
            return View();
        }

        #region AjaxRequests
        public async Task<IActionResult> GetDocumentTypes()
        {
            var documentTypes = await _context.DocumentTypes.OrderBy(x => x.Description).ToListAsync();
            return new JsonResult(documentTypes);
        }

        public async Task<IActionResult> GetAnswerTypes()
        {
            var answerTypes = await _context.AnswerTypes.OrderBy(x => x.Description).ToListAsync();
            return new JsonResult(answerTypes);
        }

        public async Task<IActionResult> GetDepartments()
        {
            var departments = await _context.GeoZones
                .Where(x => x.Code.EndsWith("0000"))
                .OrderBy(x => x.Code)
                .ToListAsync();
            return new JsonResult(departments);
        }

        public async Task<IActionResult> GetProvinces(string geoCode)
        {
            var departmentCode = geoCode.Substring(0, 2);
            var provinces = await _context.GeoZones
                .Where(x => x.Code.StartsWith(departmentCode) && x.Code.EndsWith("00") && !x.Code.EndsWith("0000"))
                .OrderBy(x => x.Code)
                .ToListAsync();
            return new JsonResult(provinces);
        }

        public async Task<IActionResult> GetDistricts(string geoCode)
        {
            var provinceCode = geoCode.Substring(0, 4);
            var districts = await _context.GeoZones
                .Where(x => x.Code.StartsWith(provinceCode) && !x.Code.EndsWith("00"))
                .OrderBy(x => x.Code)
                .ToListAsync();
            return new JsonResult(districts);
        }
        
        [HttpPost]
        public async Task<IActionResult> SaveClaim(ClaimViewModel claimRequest)
        {
            try
            {
                // GeoZone
                var geoZone = await _context.GeoZones.SingleOrDefaultAsync(x => x.Code == claimRequest.MainClaimer.GeoZone);

                // Main Claimer
                var mainClaimer = new Claimer()
                {
                    DocumentTypeID = claimRequest.MainClaimer.DocumentType,
                    DocumentNumber = claimRequest.MainClaimer.DocumentNumber,
                    Names = claimRequest.MainClaimer.Names,
                    PaternalSurname = claimRequest.MainClaimer.PaternalSurname,
                    MaternalSurname = claimRequest.MainClaimer.MaternalSurname,
                    AnswerTypeID = claimRequest.MainClaimer.AnswerType,
                    PhoneNumber = claimRequest.MainClaimer.PhoneNumber,
                    EMail = claimRequest.MainClaimer.EMail,
                    Address = claimRequest.MainClaimer.Address,
                    GeoZoneID = geoZone.ID
                };
                _context.Claimers.Add(mainClaimer);

                await _context.SaveChangesAsync();

                // Good Type
                var goodTypeEnum = claimRequest.ContractedGood.IsAProduct ?
                    GoodTypeEnum.Product : GoodTypeEnum.Service;
                var goodType = (await _context.GoodTypes.SingleOrDefaultAsync(
                    x => x.Description == goodTypeEnum.ToDbString()));

                // Claim Type
                var claimTypeEnum = claimRequest.ClaimDetail.IsAClaim ?
                    ClaimTypeEnum.Claim : ClaimTypeEnum.Complaint;
                var claimType = (await _context.ClaimTypes.SingleOrDefaultAsync(
                    x => x.Description == claimTypeEnum.ToDbString()));

                // Claim
                var claim = new Claim()
                {
                    MainClaimerID = mainClaimer.ID,
                    GuardClaimerID = null,
                    GoodTypeID = goodType.ID,
                    ClaimedAmount = claimRequest.ContractedGood.ClaimedAmount,
                    Description = claimRequest.ContractedGood.GoodDescription,
                    ClaimTypeID = claimType.ID,
                    ClaimDetail = claimRequest.ClaimDetail.ClaimDetail,
                    OrderDetail = claimRequest.ClaimDetail.OrderDetail
                };

                _context.Claims.Add(claim);

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }


            return Ok();
        }
        #endregion
    }
}
