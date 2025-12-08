var timeout = 15000;

window.setTimeout(poller, timeout);

function poller() {
  window.location.reload();
  window.setTimeout(poller, timeout);
}
