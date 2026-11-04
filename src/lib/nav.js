// Go back if there is an in-app page to return to; a screen opened directly
// (a shared link, or the installed app reopened there) has none, so go home.
export function goBack(router, fallback = '/home') {
  if (window.history.state?.back) router.back()
  else router.replace(fallback)
}
