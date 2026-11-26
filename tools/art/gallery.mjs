import { CHARS, galleryBg, svgDefs, hairBack, headFront, render } from './common.mjs'

const head = (c, scale = .64, x = 500, y = 292) => `
  <g transform="translate(${x} ${y}) scale(${scale})">${headFront(c)}</g>`
const backHair = (c, scale = .64, x = 500, y = 292) => `
  <g transform="translate(${x} ${y}) scale(${scale})">${hairBack(c)}</g>`

const chest = c => `
<g>
  <path d="M 478 352 L 522 352 C 524 396 532 424 550 438 C 568 424 576 396 578 352 L 612 374 C 636 406 648 452 646 494 C 610 522 580 534 550 536 C 520 534 490 522 454 494 C 452 452 464 406 488 374 Z" fill="url(#skin)"/>
  <path d="M 488 374 C 510 406 524 428 550 440 C 574 428 590 406 612 374 L 622 406 C 604 450 580 478 550 486 C 520 478 496 450 478 406 Z" fill="url(#skinShade)" opacity=".36"/>
  <path d="M 470 430 C 490 416 514 422 550 436 C 586 422 610 416 630 430" fill="none" stroke="${c.skin[2]}" stroke-width="2" opacity=".26"/>
  <path d="M 514 430 C 528 444 539 450 550 452 C 562 450 573 444 587 430" fill="none" stroke="${c.skin[2]}" stroke-width="1.6" opacity=".3"/>
  <ellipse cx="510" cy="400" rx="38" ry="14" fill="#fff" opacity=".1"/>
  <path d="M 478 372 C 498 368 518 380 530 396 M 622 372 C 602 368 582 380 570 396" fill="none" stroke="#fff" stroke-width="4" opacity=".1"/>
</g>`

const sweetheart = c => `
<g>
  <path d="M 448 492 C 478 500 512 514 550 534 C 588 514 622 500 652 492 L 644 676 C 600 710 400 710 356 676 Z" fill="url(#cloth)"/>
  <path d="M 448 492 C 478 502 512 516 550 536 C 588 516 622 502 652 492" fill="none" stroke="url(#gold)" stroke-width="3.4"/>
  <path d="M 452 506 C 482 516 514 530 550 548 C 586 530 618 516 648 506" fill="none" stroke="${c.inner}" stroke-width="4" opacity=".55"/>
  <path d="M 420 530 C 450 574 490 598 550 606 C 610 598 650 574 680 530" fill="none" stroke="#ffffff" stroke-width="1.5" opacity=".08"/>
</g>`

const longHair = c => `<g fill="url(#hair)">
  <path d="M 420 340 C 388 430 384 552 396 674 C 406 770 404 850 380 928 C 420 892 438 820 434 744 C 454 808 466 868 458 938 C 488 892 488 814 474 740 C 500 800 518 862 516 928 C 540 862 534 786 512 710 C 536 646 538 540 524 448 Z" opacity=".95"/>
  <path d="M 580 340 C 612 430 616 552 604 674 C 594 770 596 850 620 928 C 580 892 562 820 566 744 C 546 808 534 868 542 938 C 512 892 512 814 526 740 C 500 800 482 862 484 928 C 460 862 466 786 488 710 C 464 646 462 540 476 448 Z" opacity=".72"/>
  <g fill="none" stroke="url(#hairLight)" stroke-width="4" stroke-linecap="round" opacity=".75">
    <path d="M 428 396 C 408 540 416 700 402 864"/>
    <path d="M 574 404 C 594 544 584 700 598 860"/>
    <path d="M 468 372 C 452 500 456 620 448 728"/>
    <path d="M 540 376 C 552 494 548 604 558 716"/>
  </g>
</g>`

const gown = (c, { train = true, waistW = 150, skirtW = 360, hipW = 270 } = {}) => {
  const w = 500, bw = waistW / 2, hw = hipW / 2, sw = skirtW / 2
  return `<g>
    ${train ? `<path d="M 360 700 C 280 890 236 1160 222 1390 L 380 1390 C 350 1160 356 920 400 760 Z" fill="${c.cloth[2]}" opacity=".85"/>
    <path d="M 640 700 C 710 900 748 1160 760 1390 L 610 1390 C 636 1170 632 940 596 770 Z" fill="${c.cloth[2]}" opacity=".6"/>` : ''}
    <path d="M 406 436 C 374 468 362 518 364 568 C 366 608 380 636 420 664 C 400 694 380 728 368 770 C 348 910 326 1130 298 1370 L 702 1370 C 674 1130 652 910 632 770 C 620 728 600 694 580 664 C 620 636 634 608 636 568 C 638 518 626 468 594 436 C 572 414 548 400 522 382 L 478 382 C 452 400 428 414 406 436 Z" fill="url(#cloth)"/>
    <path d="M 406 436 C 374 468 362 518 364 568 C 366 608 380 636 420 664 C 400 694 380 728 368 770 C 348 910 326 1130 298 1370 L 400 1380 C 396 1120 400 880 424 720 C 404 680 394 640 396 590 C 400 530 418 478 448 446 Z" fill="#ffffff" opacity=".04"/>
    <path d="M 364 568 C 400 606 600 606 636 568" fill="none" stroke="url(#gold)" stroke-width="3" opacity=".8"/>
    <path d="M 420 664 C 460 700 540 700 580 664" fill="none" stroke="${c.inner}" stroke-width="5" opacity=".6"/>
    <path d="M 368 770 C 428 814 572 814 632 770" fill="none" stroke="url(#gold)" stroke-width="2.4" opacity=".6"/>
    <path d="M 406 436 C 428 414 452 400 478 382 M 594 436 C 572 414 548 400 522 382" fill="none" stroke="${c.rim}" stroke-width="2" opacity=".5"/>
    <g fill="none" stroke="url(#gold)" stroke-width="1.5" opacity=".48">
      <path d="M 378 820 C 392 990 386 1170 364 1350 M 436 850 C 446 1020 440 1190 424 1360 M 626 820 C 618 1000 626 1180 646 1350 M 566 850 C 558 1020 566 1200 582 1360"/>
      <path d="M 344 960 C 420 1000 586 1000 656 954 M 330 1120 C 412 1164 592 1164 670 1116"/>
    </g>
    <g fill="url(#gold)" opacity=".85">
      <circle cx="500" cy="744" r="6"/><circle cx="500" cy="866" r="4"/>
      <path d="M 470 1012 C 490 1030 510 1030 530 1012" fill="none" stroke="url(#gold)" stroke-width="2"/>
    </g>
  </g>`
}

const seraphineCollar = c => `
<g>
  <path d="M 478 350 L 522 350 C 524 394 533 422 550 434 C 567 422 576 394 578 350 L 612 378 C 632 412 642 460 639 508 C 604 538 580 548 550 550 C 520 548 496 538 461 508 C 458 460 468 412 488 378 Z" fill="#1b0d1e"/>
  <path d="M 488 378 C 508 404 528 420 550 428 C 572 420 592 404 612 378 L 620 408 C 600 446 580 466 550 474 C 520 466 500 446 480 408 Z" fill="#2a1430" opacity=".8"/>
  <g fill="none" stroke="#b79ccc" stroke-width="1.2" opacity=".55">
    <path d="M 470 420 C 494 452 520 470 550 478 C 580 470 606 452 630 420"/>
    <path d="M 462 456 C 490 490 520 506 550 512 C 580 506 610 490 638 456"/>
    <path d="M 470 486 C 500 516 522 528 550 532 C 578 528 600 516 630 486"/>
  </g>
  <path d="M 478 350 L 522 350 C 524 394 533 422 550 434 C 567 422 576 394 578 350" fill="none" stroke="${c.accent}" stroke-width="2.2" opacity=".8"/>
  <path d="M 500 386 C 520 400 580 400 600 386 L 602 410 C 580 426 520 426 498 410 Z" fill="#120a18"/>
  <path d="M 500 388 C 520 402 580 402 600 388" fill="none" stroke="url(#gold)" stroke-width="2"/>
  <circle cx="550" cy="404" r="7" fill="url(#gem)"/><circle cx="548" cy="402" r="2" fill="#ffe6ee"/>
  <g fill="url(#gold)" opacity=".9">
    <path d="M 636 470 L 652 486 L 638 502 L 622 486 Z"/>
    <path d="M 462 470 L 446 486 L 460 502 L 476 486 Z"/>
  </g>
  <path d="M 610 520 C 622 544 626 570 622 600 L 590 600 C 596 568 592 540 580 518 Z" fill="${c.accent}" opacity=".35"/>
</g>`

const seraphine = c => `
<g>
  ${longHair(c)}
  <g>
    <path d="M 360 690 C 300 800 276 1010 280 1200 L 320 1400 L 430 1390 C 390 1240 386 1030 410 860 Z" fill="#0d0712" opacity=".8"/>
    <path d="M 640 690 C 700 800 724 1010 720 1200 L 680 1400 L 570 1390 C 610 1240 614 1030 590 860 Z" fill="#0d0712" opacity=".55"/>
  </g>
  ${gown(c)}
  ${seraphineCollar(c)}
  <g fill="none" stroke="url(#gold)" stroke-width="1.4" opacity=".4">
    <path d="M 380 600 C 420 660 580 660 620 600"/>
    <path d="M 356 640 C 400 690 600 690 644 640"/>
  </g>
  <path d="M 356 676 C 400 712 600 712 644 676" fill="none" stroke="url(#gold)" stroke-width="5"/>
  <path d="M 364 692 C 410 728 590 728 636 692" fill="none" stroke="${c.inner}" stroke-width="6" opacity=".75"/>
  <path d="M 386 664 C 430 706 570 706 612 664" fill="none" stroke="url(#gold)" stroke-width="4"/>
  <path d="M 370 676 C 420 728 580 728 630 676 L 620 722 C 570 766 430 766 380 722 Z" fill="#1b0d1d" opacity=".9"/>
  <path d="M 382 690 C 430 728 570 728 618 690" fill="none" stroke="${c.inner}" stroke-width="5" opacity=".8"/>
  <g stroke="url(#gold)" stroke-width="2" fill="none" opacity=".9">
    <path d="M 500 730 C 512 766 508 798 500 826"/>
    ${[0, 1, 2, 3, 4, 5].map(i => `<path d="M ${470 + (i % 2) * 20} ${842 + i * 34} l 15 9 l 15 -9"/>`).join('')}
    <path d="M 360 1040 C 430 1084 570 1084 640 1038 M 344 1200 C 424 1248 576 1248 656 1198"/>
  </g>
  <path d="M 500 1060 C 478 1090 480 1140 500 1160 C 520 1140 522 1090 500 1060 Z" fill="none" stroke="url(#gold)" stroke-width="2" opacity=".7"/>
  <g>
    <path d="M 578 1012 C 594 1090 612 1200 620 1312 L 652 1316 C 650 1200 638 1080 620 992 Z" fill="#170f1e"/>
    <path d="M 586 1040 C 598 1120 608 1200 614 1290" fill="none" stroke="${c.rim}" stroke-width="2" opacity=".35"/>
    <path d="M 628 1030 C 638 1120 642 1210 644 1300" fill="none" stroke="#fff" stroke-width="2.4" opacity=".12"/>
    <g stroke="#8a6b98" stroke-width=".9" opacity=".28">
      <path d="M 580 1050 L 648 1110 M 584 1090 L 648 1150 M 588 1130 L 648 1190 M 592 1170 L 648 1230 M 596 1210 L 648 1270 M 600 1250 L 648 1310"/>
      <path d="M 636 1030 L 594 1308 M 646 1060 L 608 1310 M 650 1100 L 620 1312"/>
    </g>
    <path d="M 580 1020 C 610 1040 636 1038 652 1022 L 650 1040 C 634 1056 610 1056 584 1042 Z" fill="url(#gold)" opacity=".8"/>
    <path d="M 612 1310 L 650 1314 L 664 1360 L 712 1380 C 724 1388 718 1400 704 1400 L 628 1400 C 618 1384 612 1346 612 1310 Z" fill="#0e0813"/>
    <path d="M 610 1332 L 658 1338" stroke="url(#gold)" stroke-width="3"/>
    <path d="M 574 1004 C 594 1080 610 1180 618 1300" fill="none" stroke="${c.inner}" stroke-width="3" opacity=".8"/>
  </g>
  <g>
    <path d="M 408 442 C 362 466 334 518 326 580 C 318 642 326 696 340 742 L 392 732 C 378 688 376 640 386 594 C 396 548 416 506 442 480 Z" fill="#221026"/>
    <path d="M 408 442 C 362 466 334 518 326 580 C 318 642 326 696 340 742" fill="none" stroke="${c.rim}" stroke-width="2.4" opacity=".55"/>
    <path d="M 398 462 C 362 492 344 540 338 592" fill="none" stroke="#8d6b9e" stroke-width="1.6" opacity=".35"/>
    <path d="M 342 728 C 348 762 362 786 382 798 L 404 770 C 386 758 374 734 370 706 Z" fill="url(#skin)"/>
    <path d="M 382 798 C 394 812 414 808 420 792" fill="none" stroke="url(#gold)" stroke-width="3"/>
  </g>
  <g>
    <path d="M 594 446 C 634 470 660 520 668 580 C 676 640 670 692 658 738 L 612 730 C 624 686 626 640 616 594 C 606 548 586 508 560 482 Z" fill="#1a0d1f"/>
    <path d="M 658 728 C 652 762 638 786 618 798 L 596 770 C 614 758 626 734 630 706 Z" fill="url(#skin)"/>
    <path d="M 596 798 C 606 816 626 820 638 806" fill="none" stroke="url(#gold)" stroke-width="3"/>
    <path d="M 640 800 C 650 830 644 860 628 876" fill="none" stroke="url(#gold)" stroke-width="2" opacity=".8"/>
    <g opacity=".9">
      <path d="M 628 876 L 642 892 L 634 918" fill="none" stroke="url(#gold)" stroke-width="2"/>
      <path d="M 610 930 C 630 918 648 928 650 946 C 652 964 638 976 624 968 C 612 960 610 944 610 930 Z" fill="url(#gold)" filter="url(#glowS)" opacity=".8"/>
      <path d="M 620 942 C 630 936 640 942 640 950 C 640 958 630 962 624 956" fill="none" stroke="#fff4c9" stroke-width="2"/>
    </g>
  </g>
  ${head(c)}
  <g>
    <path d="M 566 520 C 552 540 552 564 564 578 C 576 566 578 540 574 520 Z" fill="url(#skin)"/>
    <path d="M 556 574 C 566 590 582 590 590 578" fill="none" stroke="url(#gold)" stroke-width="3"/>
  </g>
</g>`

const mirelle = c => `
<g>
  ${longHair(c)}
  <path d="M 330 720 C 266 860 240 1130 244 1390 L 380 1390 C 356 1160 362 900 410 760 Z" fill="#1a0812" opacity=".92"/>
  <path d="M 672 720 C 736 860 762 1130 758 1390 L 622 1390 C 646 1160 640 900 592 760 Z" fill="#1a0812" opacity=".75"/>
  ${gown(c)}
  <path d="M 430 470 C 468 512 532 512 570 470 L 606 508 C 578 556 422 556 394 508 Z" fill="url(#cloth)"/>
  <path d="M 430 470 C 468 512 532 512 570 470" fill="none" stroke="url(#gold)" stroke-width="3"/>
  <path d="M 394 508 C 430 552 570 552 606 508" fill="none" stroke="url(#gold)" stroke-width="2" opacity=".7"/>
  <path d="M 486 490 C 478 530 478 566 486 590 C 494 566 494 530 486 490 Z" fill="url(#skin)"/>
  <path d="M 486 490 C 478 530 478 566 486 590" fill="none" stroke="url(#gold)" stroke-width="2"/>
  <path d="M 420 430 C 414 460 420 486 438 500 C 452 476 460 446 458 420 Z" fill="url(#skin)"/>
  <path d="M 580 430 C 586 460 580 486 562 500 C 548 476 540 446 542 420 Z" fill="url(#skin)"/>
  <path d="M 460 396 C 484 420 516 426 540 420 C 524 440 476 440 460 422 Z" fill="url(#gold)" opacity=".7"/>
  <path d="M 500 398 C 520 414 580 414 600 398 L 596 436 C 574 452 526 452 504 436 Z" fill="#1a0812"/>
  <path d="M 502 402 C 522 416 578 416 598 402" fill="none" stroke="url(#gold)" stroke-width="2"/>
  <circle cx="550" cy="430" r="8" fill="url(#gem)"/><circle cx="548" cy="428" r="2.4" fill="#fff"/>
  <path d="M 356 676 C 400 712 600 712 644 676" fill="none" stroke="url(#gold)" stroke-width="5"/>
  <path d="M 364 692 C 410 728 590 728 636 692" fill="none" stroke="#9e2c50" stroke-width="6" opacity=".75"/>
  <path d="M 386 552 C 424 606 576 606 614 552" fill="none" stroke="url(#gold)" stroke-width="3"/>
  <g fill="none" stroke="url(#gold)" stroke-width="2" opacity=".8">
    <path d="M 406 574 C 470 646 530 646 594 574"/>
    <path d="M 428 598 C 482 666 518 666 572 598"/>
    <path d="M 500 662 L 500 812"/>
    <path d="M 386 1040 C 448 1090 552 1090 614 1038"/>
    <path d="M 370 1200 C 440 1250 560 1250 630 1198"/>
  </g>
  <g fill="${c.accent}" opacity=".9">
    ${[0, 1, 2, 3, 4, 5, 6].map(i => `<circle cx="${414 + i * 29}" cy="${592 + Math.sin(i / 6 * Math.PI) * 26}" r="4"/>`).join('')}
    <circle cx="500" cy="700" r="10" fill="url(#gem)"/><circle cx="500" cy="700" r="3" fill="#fff"/>
  </g>
  <path d="M 500 700 C 486 736 486 768 500 794 C 514 768 514 736 500 700 Z" fill="url(#gold)"/>
  <g>
    <path d="M 560 1018 C 576 1100 594 1200 602 1310 L 636 1314 C 634 1200 620 1080 602 996 Z" fill="#241018"/>
    <path d="M 570 1040 C 582 1120 592 1200 598 1290" fill="none" stroke="${c.rim}" stroke-width="2" opacity=".3"/>
    <path d="M 612 1030 C 622 1120 626 1210 628 1300" fill="none" stroke="#fff" stroke-width="2.2" opacity=".1"/>
    <g stroke="#c08a9e" stroke-width=".9" opacity=".22">
      <path d="M 564 1054 L 632 1114 M 568 1094 L 632 1154 M 572 1134 L 632 1194 M 576 1174 L 632 1234 M 580 1214 L 632 1274 M 584 1254 L 632 1314"/>
      <path d="M 620 1034 L 578 1308 M 630 1064 L 592 1310 M 634 1104 L 604 1312"/>
    </g>
    <path d="M 562 1026 C 592 1046 620 1044 636 1028 L 634 1046 C 618 1062 592 1062 566 1048 Z" fill="url(#gold)" opacity=".8"/>
    <path d="M 594 1308 L 632 1312 L 646 1358 L 694 1378 C 706 1386 700 1398 686 1398 L 610 1398 C 600 1382 594 1344 594 1308 Z" fill="#170710"/>
    <path d="M 592 1330 L 640 1336" stroke="url(#gold)" stroke-width="3"/>
    <path d="M 556 1010 C 576 1086 592 1180 600 1300" fill="none" stroke="${c.inner}" stroke-width="3" opacity=".75"/>
  </g>
  <g>
    <path d="M 408 446 C 368 478 348 534 346 594 C 344 650 354 696 368 734 L 410 720 C 398 680 392 640 396 600 C 402 550 420 510 444 484 Z" fill="#2b0c1c"/>
    <path d="M 408 446 C 368 478 348 534 346 594" fill="none" stroke="${c.rim}" stroke-width="2.4" opacity=".55"/>
    <path d="M 350 704 C 360 722 380 728 400 718" fill="none" stroke="url(#gold)" stroke-width="2" opacity=".8"/>
    <path d="M 368 734 C 374 768 388 792 406 806 L 424 778 C 408 764 398 740 394 714 Z" fill="url(#skin)"/>
    <g transform="translate(352 846) rotate(-12)">
      <path d="M -18 -48 L 8 -54 L 14 -28 L 16 26 C 8 40 -8 40 -16 26 L -14 -28 Z" fill="url(#gem)" opacity=".65"/>
      <path d="M -10 -38 L 2 -42 L 6 -24 L 6 20 C 2 30 -6 30 -10 20 Z" fill="#8ef7d6" opacity=".55"/>
      <rect x="-9" y="-68" width="18" height="18" rx="4" fill="url(#gold)"/>
      <circle cx="0" cy="-72" r="7" fill="url(#gem)"/>
    </g>
    <path d="M 364 848 C 352 842 346 830 352 818 C 358 806 372 808 378 820 C 384 832 378 844 370 852 Z" fill="url(#skin)"/>
    <path d="M 358 824 C 364 820 372 822 376 828" fill="none" stroke="${c.skin[2]}" stroke-width="2" opacity=".7"/>
    <g fill="none" stroke="url(#gold)" stroke-width="4" stroke-linecap="round">
      <path d="M 410 620 C 398 650 394 686 400 716 M 434 612 C 422 644 418 680 424 710"/>
    </g>
    <g fill="${c.accent}"><circle cx="402" cy="642" r="4"/><circle cx="424" cy="634" r="3.4"/></g>
  </g>
  <g>
    <path d="M 592 446 C 632 478 652 534 654 594 C 656 650 646 696 632 734 L 590 720 C 602 680 608 640 604 600 C 598 550 580 510 556 484 Z" fill="#2b0c1c"/>
    <path d="M 592 446 C 632 478 652 534 654 594" fill="none" stroke="${c.rim}" stroke-width="2.4" opacity=".45"/>
    <path d="M 626 704 C 614 720 596 726 580 718" fill="none" stroke="url(#gold)" stroke-width="2" opacity=".8"/>
    <path d="M 590 800 C 600 818 620 822 632 808" fill="none" stroke="url(#gold)" stroke-width="3"/>
  </g>
  ${head(c)}
</g>`

const ysolde = c => `
<g>
  ${longHair(c)}
  <path d="M 330 470 C 260 620 224 920 238 1200 C 244 1300 260 1370 280 1410 L 430 1410 C 392 1220 384 1000 402 820 C 414 700 434 590 456 520 Z" fill="#04171d" opacity=".95"/>
  <path d="M 672 470 C 738 620 772 920 760 1200 C 754 1300 740 1370 720 1410 L 566 1410 C 606 1220 614 1000 598 820 C 586 700 566 590 544 520 Z" fill="#04171d" opacity=".8"/>
  <path d="M 440 430 C 404 470 390 530 392 590 C 394 640 406 676 420 704 C 398 740 386 790 386 840 L 398 1030 L 602 1030 L 614 840 C 614 790 602 740 580 704 C 594 676 606 640 608 590 C 610 530 596 470 560 430 C 540 410 526 396 518 378 L 482 378 C 474 396 460 410 440 430 Z" fill="url(#cloth)"/>
  <path d="M 440 430 C 404 470 390 530 392 590 C 394 640 406 676 420 704 C 398 740 386 790 386 840 L 398 1030 L 448 1030 C 432 900 432 770 454 660 C 436 626 426 586 428 542 C 432 494 446 456 466 438 Z" fill="#2f5263" opacity=".35"/>
  <path d="M 474 356 L 526 356 C 529 398 538 424 555 436 C 572 424 581 398 584 356 L 614 384 C 634 422 642 474 636 522 C 600 554 578 566 550 568 C 520 566 498 554 464 522 C 458 474 466 422 486 384 Z" fill="#0e202b"/>
  <path d="M 486 384 C 506 414 530 432 550 440 C 572 432 594 414 614 384 L 620 414 C 598 456 578 478 550 488 C 522 478 500 456 480 414 Z" fill="#1f3b49" opacity=".7"/>
  <path d="M 480 470 C 510 510 534 528 550 534 C 568 528 592 510 620 470" fill="none" stroke="url(#gold)" stroke-width="3"/>
  <path d="M 490 506 C 516 536 536 548 550 554 C 566 548 586 536 610 506" fill="none" stroke="#6f94a4" stroke-width="2" opacity=".5"/>
  <path d="M 500 394 C 520 410 580 410 600 394 L 596 428 C 574 444 526 444 504 428 Z" fill="#08141b"/>
  <path d="M 502 396 C 522 412 578 412 598 396" fill="none" stroke="url(#gold)" stroke-width="2"/>
  <circle cx="550" cy="422" r="8" fill="url(#gem)"/><circle cx="548" cy="420" r="2.4" fill="#fff"/>
  <path d="M 424 486 C 458 528 542 528 576 486 L 596 560 C 566 614 434 614 404 560 Z" fill="#142936"/>
  <path d="M 424 486 C 458 526 542 526 576 486" fill="none" stroke="url(#gold)" stroke-width="3.4"/>
  <path d="M 418 560 C 452 602 548 602 582 560" fill="none" stroke="#6f94a4" stroke-width="3" opacity=".5"/>
  <path d="M 408 476 C 372 494 352 528 350 566 C 366 568 386 558 402 540 C 396 520 400 494 408 476 Z" fill="#1b3846" stroke="url(#gold)" stroke-width="2"/>
  <path d="M 592 476 C 628 494 648 528 650 566 C 634 568 614 558 598 540 C 604 520 600 494 592 476 Z" fill="#1b3846" stroke="url(#gold)" stroke-width="2"/>
  <path d="M 392 700 C 440 736 560 736 608 700 L 600 750 C 556 780 444 780 400 750 Z" fill="#0c1b23"/>
  <path d="M 396 706 C 444 740 556 740 604 706" fill="none" stroke="url(#gold)" stroke-width="3"/>
  <g fill="none" stroke="url(#gold)" stroke-width="2" opacity=".65">
    <path d="M 430 610 L 570 610 M 420 676 L 580 676 M 410 760 L 590 760"/>
    <path d="M 500 600 L 500 840"/>
    <path d="M 450 620 L 432 840 M 550 620 L 568 840"/>
  </g>
  <g fill="url(#gold)">
    <path d="M 500 690 L 512 712 L 500 734 L 488 712 Z"/>
    <circle cx="500" cy="712" r="4" fill="${c.gem}"/>
    <circle cx="444" cy="694" r="5"/><circle cx="556" cy="694" r="5"/>
  </g>
  <path d="M 386 840 C 420 880 580 880 614 840 L 606 900 C 570 940 430 940 394 900 Z" fill="#0a1821"/>
  <g>
    <path d="M 424 900 C 408 980 400 1100 404 1200 L 412 1300 L 462 1300 C 452 1170 456 1040 474 960 L 478 900 Z" fill="#0d222b"/>
    <path d="M 576 900 C 592 980 600 1100 596 1200 L 588 1300 L 538 1300 C 548 1170 544 1040 526 960 L 522 900 Z" fill="#0d222b"/>
    <path d="M 458 914 C 448 1010 448 1120 456 1210 L 468 1264 L 486 1260 C 480 1160 482 1040 492 944 Z" fill="#16323d" opacity=".65"/>
    <g fill="none" stroke="url(#gold)" stroke-width="3" opacity=".8">
      <path d="M 414 950 C 430 1000 436 1060 432 1120 M 586 950 C 570 1000 564 1060 568 1120"/>
      <path d="M 406 1180 L 466 1180 M 594 1180 L 534 1180"/>
    </g>
    <path d="M 404 1264 L 462 1264 L 470 1330 L 468 1380 L 530 1402 C 542 1410 536 1422 522 1422 L 430 1422 C 414 1392 406 1324 404 1264 Z" fill="#07141a"/>
    <path d="M 596 1264 L 538 1264 L 530 1330 L 532 1380 L 470 1402 C 458 1410 464 1422 478 1422 L 570 1422 C 586 1392 594 1324 596 1264 Z" fill="#07141a"/>
    <path d="M 416 1276 L 464 1276 M 584 1276 L 536 1276" stroke="url(#gold)" stroke-width="4"/>
    <path d="M 430 1380 C 452 1392 486 1400 510 1404 M 570 1380 C 548 1392 514 1400 490 1404" fill="none" stroke="url(#gold)" stroke-width="2" opacity=".7"/>
  </g>
  <g>
    <path d="M 434 442 C 382 476 350 550 344 630 C 338 700 348 760 362 808 L 408 794 C 392 744 384 690 390 638 C 396 578 418 522 448 486 Z" fill="#102832"/>
    <path d="M 434 442 C 382 476 350 550 344 630" fill="none" stroke="${c.rim}" stroke-width="2" opacity=".5"/>
    <path d="M 362 798 C 368 828 382 850 400 862 L 420 834 C 404 820 392 798 386 774 Z" fill="#102832"/>
    <path d="M 400 862 C 412 878 432 874 440 858" fill="none" stroke="url(#gold)" stroke-width="4"/>
  </g>
  <g>
    <path d="M 566 442 C 618 476 650 550 656 630 C 662 700 652 760 638 808 L 592 794 C 608 744 616 690 610 638 C 604 578 582 522 552 486 Z" fill="#102832"/>
    <path d="M 638 798 C 632 828 618 850 600 862 L 580 834 C 596 820 608 798 614 774 Z" fill="#102832"/>
    <g transform="translate(700 860) rotate(22)">
      <rect x="-5" y="-300" width="10" height="330" rx="4" fill="#9aa9b4"/>
      <rect x="-1.5" y="-300" width="3" height="330" fill="#e7f3f6" opacity=".7"/>
      <path d="M -54 40 C -40 -10 -20 -26 0 -26 C 20 -26 40 -10 54 40 L 40 48 C 28 12 16 0 0 0 C -16 0 -28 12 -40 48 Z" fill="url(#gold)"/>
      <path d="M -54 40 L 54 40" stroke="#5b431c" stroke-width="4"/>
      <path d="M -10 -70 C -10 -120 10 -120 10 -70 L 10 40 L -10 40 Z" fill="#203644" stroke="url(#gold)" stroke-width="3"/>
      <circle cx="0" cy="14" r="6" fill="${c.gem}"/>
    </g>
    <path d="M 600 846 C 586 830 588 804 606 790 C 626 774 650 784 658 806 C 666 828 654 850 636 858 C 622 864 610 860 600 846 Z" fill="#1a2d39" stroke="url(#gold)" stroke-width="2"/>
    <path d="M 608 814 C 618 810 630 814 638 822 M 604 830 C 616 824 630 828 640 836" fill="none" stroke="#7896a3" stroke-width="2" opacity=".7"/>
  </g>
  ${head(c)}
</g>`

const build = (c, body) => svgDefs(c) + galleryBg(c) + backHair(c) + body

const SVGS = {
  seraphine: c => build(c, seraphine(c)),
  mirelle: c => build(c, mirelle(c)),
  ysolde: c => build(c, ysolde(c)),
}

for (const key of Object.keys(CHARS)) {
  await render(`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1500" viewBox="0 0 1000 1500">${SVGS[key](CHARS[key])}</svg>`, `${key}_gallery.png`, 1000, 1500)
}
