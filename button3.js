(async () =>{
    document.querySelector('[aria-label="High Confidence"]').click();
    await waiter(500);
    document.querySelector('.btn.btn-primary.next-button').click();
  })()