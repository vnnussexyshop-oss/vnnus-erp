let deferredInstallPrompt=null;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredInstallPrompt=e;document.getElementById("installBtn").hidden=false});
document.addEventListener("DOMContentLoaded",()=>{
 document.querySelectorAll(".menu-item").forEach(b=>b.addEventListener("click",()=>navigateTo(b.dataset.page)));
 document.getElementById("mobileMenuBtn").addEventListener("click",openMobileMenu);
 document.getElementById("sidebarOverlay").addEventListener("click",closeMobileMenu);
 document.getElementById("refreshBtn").addEventListener("click",()=>navigateTo(location.hash.replace("#","")||"dashboard"));
 document.getElementById("installBtn").addEventListener("click",async()=>{if(!deferredInstallPrompt)return;deferredInstallPrompt.prompt();await deferredInstallPrompt.userChoice;deferredInstallPrompt=null;document.getElementById("installBtn").hidden=true});
 if("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(console.error);
 navigateTo(location.hash.replace("#","")||"dashboard");
});
function openMobileMenu(){document.getElementById("sidebar").classList.add("open");document.getElementById("sidebarOverlay").classList.add("open")}
function closeMobileMenu(){document.getElementById("sidebar").classList.remove("open");document.getElementById("sidebarOverlay").classList.remove("open")}
