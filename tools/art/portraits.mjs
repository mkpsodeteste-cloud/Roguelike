import { CHARS, portraitBg, svgDefs, hairBack, headFront, render } from './common.mjs'

const neckAndChest = `<g>
  <path d="M 512 466 L 588 466 C 590 522 604 566 636 598 C 698 632 744 688 760 790 L 786 1250 L 314 1250 L 340 790 C 356 688 402 632 464 598 C 496 566 510 522 512 466 Z" fill="url(#skin)"/>
  <path d="M 512 466 C 516 520 512 558 492 584 C 520 574 542 574 550 588 C 558 574 580 574 608 584 C 588 558 584 520 588 466 Z" fill="url(#skinShade)" opacity=".45"/>
  <path d="M 466 602 C 500 626 526 640 550 642 C 574 640 600 626 634 602" fill="none" stroke="${CHARS.seraphine.skin[2]}" stroke-width="2" opacity=".4"/>
  <path d="M 550 588 L 550 624" stroke="${CHARS.seraphine.skin[2]}" stroke-width="2" opacity=".35"/>
  <ellipse cx="500" cy="576" rx="46" ry="18" fill="#fff" opacity=".12"/>
</g>`

const seraphine = (c) => {
  const body = `
  ${neckAndChest}
  <path d="M 342 712 C 380 656 452 642 500 682 C 518 698 536 702 550 690 C 564 702 582 698 600 682 C 648 642 720 656 758 712 L 792 1250 L 308 1250 Z" fill="url(#cloth)"/>
  <path d="M 342 712 C 380 656 452 642 500 682 C 518 698 536 702 550 690 C 564 702 582 698 600 682 C 648 642 720 656 758 712 L 768 786 C 690 738 612 718 550 718 C 488 718 410 738 332 786 Z" fill="url(#cloth2)" opacity=".55"/>
  <path d="M 344 710 C 382 658 452 646 500 684 C 518 699 536 703 550 692 C 564 703 582 699 600 684 C 648 646 718 658 756 710" fill="none" stroke="url(#gold)" stroke-width="4" opacity=".85"/>
  <path d="M 350 726 C 390 680 450 672 496 704 M 750 726 C 710 680 650 672 604 704" fill="none" stroke="${c.inner}" stroke-width="5" opacity=".7"/>
  <g fill="none" stroke="#8f709f" stroke-width="1.6" opacity=".55">
    <path d="M 364 760 C 380 900 372 1100 350 1250"/>
    <path d="M 736 760 C 720 900 728 1100 750 1250"/>
    <path d="M 420 754 C 410 930 404 1110 400 1250"/>
    <path d="M 680 754 C 690 930 696 1110 700 1250"/>
    <path d="M 550 742 L 550 1250"/>
  </g>
  <g fill="none" stroke="#d8bd83" stroke-width="2" opacity=".8">
    <path d="M 500 790 C 522 830 546 838 550 806 C 554 838 578 830 600 790"/>
    <path d="M 470 900 C 506 950 594 950 630 900"/>
    <path d="M 460 1030 C 508 1080 592 1080 640 1030"/>
    <path d="M 448 1160 C 505 1204 595 1204 652 1160"/>
  </g>
  <g fill="url(#gold)">
    <circle cx="500" cy="806" r="6"/><circle cx="550" cy="830" r="8"/><circle cx="600" cy="806" r="6"/>
    <circle cx="550" cy="960" r="5"/><circle cx="550" cy="1090" r="5"/>
  </g>
  <g stroke="#c7a46a" stroke-width="2.2" fill="none">
    <path d="M 550 830 L 550 1250" opacity=".45"/>
    ${[0, 1, 2, 3, 4, 5, 6].map(i => `<path d="M ${516 + i * 10} ${890 + i * 40} l 20 12 l 20 -12" opacity=".7"/>`).join('')}
  </g>
  <path d="M 490 610 C 518 646 582 646 610 610 C 600 660 500 660 490 610 Z" fill="#1a0c1c" opacity=".75"/>
  <path d="M 488 606 C 514 640 586 640 612 606" fill="none" stroke="#f0d9a3" stroke-width="2.5" opacity=".7"/>
  <g fill="url(#gold)" opacity=".9">
    ${[0, 1, 2, 3, 4].map(i => `<circle cx="${502 + i * 24}" cy="${622 + Math.abs(2 - i) * 7}" r="3.2"/>`).join('')}
  </g>
  <path d="M 500 544 C 520 558 580 558 600 544 L 602 570 C 580 586 520 586 498 570 Z" fill="#170b1a"/>
  <path d="M 500 546 C 520 560 580 560 600 546" fill="none" stroke="#d5bd87" stroke-width="2.4" opacity=".9"/>
  <path d="M 500 570 C 520 584 580 584 600 570" fill="none" stroke="#8d6f99" stroke-width="1.5" opacity=".7"/>
  <g fill="url(#gold)" opacity=".9">${[0,1,2,3,4,5,6].map(i=>`<circle cx="${506+i*15}" cy="${576+Math.sin(i/6*Math.PI)*5}" r="2.4"/>`).join('')}</g>
  <circle cx="550" cy="566" r="7" fill="url(#gem)"/><circle cx="548" cy="564" r="2" fill="#ffe6ee"/>
  <g opacity=".9">
    <path d="M 374 652 C 338 670 318 720 308 790 C 300 856 300 940 306 1020 L 356 1020 C 350 920 352 820 368 748 C 374 720 386 688 400 670 Z" fill="#201126"/>
    <path d="M 726 652 C 762 670 782 720 792 790 C 800 856 800 940 794 1020 L 744 1020 C 750 920 748 820 732 748 C 726 720 714 688 700 670 Z" fill="#201126"/>
    <g fill="none" stroke="#b39ac4" stroke-width="1.3" opacity=".6">
      <path d="M 330 760 C 360 800 370 900 366 1000 M 354 740 C 384 790 392 880 390 980"/>
      <path d="M 670 760 C 640 800 630 900 634 1000 M 646 740 C 616 790 608 880 610 980"/>
    </g>
    <path d="M 352 660 C 330 700 326 770 334 840 C 340 900 350 960 360 1010" fill="none" stroke="#3b2244" stroke-width="42" stroke-linecap="round" opacity=".55"/>
    <path d="M 748 660 C 770 700 774 770 766 840 C 760 900 750 960 740 1010" fill="none" stroke="#3b2244" stroke-width="42" stroke-linecap="round" opacity=".55"/>
  </g>
  <g>
    <path d="M 714 662 C 782 708 816 790 806 856 C 802 884 780 896 762 884 C 744 872 744 850 752 828 C 766 786 764 742 738 708 Z" fill="url(#skin)"/>
    <path d="M 726 672 C 774 730 790 798 782 846" fill="none" stroke="${c.skin[2]}" stroke-width="2" opacity=".35"/>
    <path d="M 800 858 C 782 792 754 724 712 664 C 696 638 678 616 660 600 L 694 568 C 720 596 744 632 766 682 C 792 742 818 812 822 860 Z" fill="#1c0f22"/>
    <path d="M 800 858 C 782 792 754 724 712 664" fill="none" stroke="#4b2c55" stroke-width="2.5" opacity=".75"/>
    <g fill="none" stroke="#b89ccc" stroke-width="1.2" opacity=".45">
      <path d="M 742 714 C 760 760 774 814 782 852 M 762 694 C 780 742 794 798 802 840"/>
    </g>
    <path d="M 704 618 C 688 600 690 578 704 566 C 718 554 738 556 748 570 L 740 606 C 730 622 716 628 704 618 Z" fill="#1c0f22"/>
    <path d="M 694 580 C 708 570 726 572 736 582" fill="none" stroke="#b89ccc" stroke-width="2" opacity=".6"/>
  </g>`
  const foreground = `<g>
    <g>
      <path d="M 704 586 C 694 570 698 550 712 542 C 726 534 744 540 748 554 C 752 568 742 582 728 586 Z" fill="url(#skin)"/>
      <g fill="url(#skin)" stroke="${c.skin[2]}" stroke-width="1.4">
        <path d="M 704 566 C 698 546 696 528 700 512 C 706 506 714 512 714 522 L 716 566 Z"/>
        <path d="M 718 562 C 714 540 714 520 720 506 C 727 501 735 508 734 520 L 732 566 Z"/>
        <path d="M 732 564 C 732 544 736 526 744 514 C 751 511 758 518 756 530 L 748 572 Z"/>
        <path d="M 744 572 C 748 556 754 544 762 538 C 768 537 772 544 768 552 L 756 578 Z"/>
      </g>
      <path d="M 700 574 C 688 566 682 552 686 542 C 690 534 698 536 702 544 L 712 566 Z" fill="url(#skin)" stroke="${c.skin[2]}" stroke-width="1.2"/>
      <path d="M 704 532 C 704 544 712 550 720 548 M 720 528 C 718 540 724 548 732 546 M 738 538 C 738 548 744 556 752 554" fill="none" stroke="${c.skin[2]}" stroke-width="1.6" opacity=".55"/>
      <path d="M 696 542 C 706 554 724 558 738 552" fill="none" stroke="#5a2038" stroke-width="2" opacity=".55"/>
    </g>
    <g fill="url(#gold)" opacity=".9"><circle cx="712" cy="590" r="3.4"/><circle cx="742" cy="586" r="2.6"/></g>
    <path d="M 690 600 C 710 616 744 612 762 592" fill="none" stroke="#3a2250" stroke-width="1.4" opacity=".6"/>
  </g>`
  return portraitBg(c) + `<g transform="translate(550 390)">${hairBack(c)}</g>` + body + `<g transform="translate(550 390)">${headFront(c)}</g>` + foreground
}

const mirelle = (c) => {
  const body = `
  ${neckAndChest}
  <path d="M 330 730 C 372 672 448 650 500 692 C 520 710 536 710 550 700 C 564 710 580 710 600 692 C 652 650 728 672 770 730 L 810 1250 L 290 1250 Z" fill="url(#cloth)"/>
  <path d="M 330 730 C 372 672 448 650 500 692 C 520 710 536 710 550 700 C 564 710 580 710 600 692 C 652 650 728 672 770 730 L 774 790 C 692 736 610 716 550 716 C 490 716 408 736 326 790 Z" fill="url(#cloth2)" opacity=".65"/>
  <path d="M 334 732 C 374 676 448 656 500 696 C 520 712 536 712 550 702 C 564 712 580 712 600 696 C 652 656 726 676 766 732" fill="none" stroke="url(#gold)" stroke-width="4"/>
  <path d="M 342 752 C 386 706 444 696 492 724 M 758 752 C 714 706 656 696 608 724" fill="none" stroke="#8b2544" stroke-width="5" opacity=".8"/>
  <g fill="none" stroke="url(#gold)" stroke-width="2.4" opacity=".85">
    <path d="M 352 802 C 430 874 670 874 748 802"/>
    <path d="M 372 832 C 448 900 652 900 728 832"/>
    <path d="M 550 872 L 550 1250"/>
    <path d="M 470 952 C 510 990 590 990 630 952"/>
    <path d="M 450 1070 C 506 1110 594 1110 650 1070"/>
    <path d="M 438 1190 C 504 1230 596 1230 662 1190"/>
  </g>
  <g fill="${c.accent}" opacity=".9">
    ${[0, 1, 2, 3, 4, 5, 6].map(i => `<circle cx="${390 + i * 53}" cy="${830 + Math.sin(i / 6 * Math.PI) * -22}" r="4"/>`).join('')}
    <circle cx="550" cy="940" r="8" fill="${c.gem}"/>
    <circle cx="550" cy="940" r="3" fill="#fff"/>
  </g>
  <path d="M 494 574 C 512 592 588 592 606 574 L 602 606 C 580 622 520 622 498 606 Z" fill="#1d0a16"/>
  <path d="M 498 606 C 516 628 584 628 602 606" fill="none" stroke="url(#gold)" stroke-width="3"/>
  <path d="M 550 620 C 540 646 540 666 550 690 C 560 666 560 646 550 620 Z" fill="url(#gold)"/>
  <circle cx="550" cy="700" r="11" fill="url(#gem)"/><circle cx="550" cy="700" r="3.5" fill="#e9fff9"/>
  <g opacity=".9">
    <path d="M 360 668 C 322 690 304 744 300 812 C 298 900 306 980 320 1050 L 368 1050 C 356 956 356 850 374 772 C 382 736 396 696 414 674 Z" fill="url(#cloth)"/>
    <path d="M 740 668 C 778 690 796 744 800 812 C 802 900 794 980 780 1050 L 732 1050 C 744 956 744 850 726 772 C 718 736 704 696 686 674 Z" fill="url(#cloth)"/>
    <g fill="none" stroke="url(#gold)" stroke-width="2" opacity=".8">
      <path d="M 338 730 C 322 820 322 940 336 1040 M 718 730 C 734 820 734 940 720 1040"/>
    </g>
    <g fill="url(#gold)">
      <ellipse cx="332" cy="760" rx="14" ry="5"/><ellipse cx="332" cy="790" rx="12" ry="4"/>
      <ellipse cx="768" cy="760" rx="14" ry="5"/><ellipse cx="768" cy="790" rx="12" ry="4"/>
    </g>
  </g>
  <g>
    <path d="M 372 672 C 334 696 306 756 300 826 C 298 848 306 862 318 860 C 332 858 340 842 348 812 C 360 766 382 728 404 704 Z" fill="url(#skin)"/>
    <path d="M 370 690 C 344 716 326 760 318 804" fill="none" stroke="${c.skin[2]}" stroke-width="2" opacity=".35"/>
    <g fill="none" stroke="url(#gold)" stroke-width="4" stroke-linecap="round">
      <path d="M 330 712 C 318 736 314 770 320 800"/>
      <path d="M 346 704 C 334 728 330 758 334 786"/>
    </g>
    <g fill="url(#gold)"><circle cx="320" cy="716" r="4"/><circle cx="326" cy="748" r="3"/><circle cx="340" cy="706" r="3.4"/></g>
  </g>`
  const foreground = `<g>
    <path d="M 300 838 C 296 868 300 900 312 922 C 324 944 348 944 360 922 C 372 900 370 868 358 844 C 346 856 330 860 316 856 Z" fill="url(#skin)"/>
    <path d="M 308 876 C 320 890 342 890 356 876" fill="none" stroke="${c.skin[2]}" stroke-width="2" opacity=".5"/>
    <g transform="translate(330 760) rotate(-14)">
      <path d="M -24 -58 L 8 -66 L 18 -34 L 20 34 C 12 50 -12 50 -20 34 L -18 -34 Z" fill="url(#gem)" opacity=".7"/>
      <path d="M -16 -46 L 2 -50 L 8 -30 L 8 28 C 2 38 -8 38 -12 28 L -12 -30 Z" fill="#8ef7d6" opacity=".55"/>
      <rect x="-12" y="-82" width="24" height="22" rx="5" fill="url(#gold)"/>
      <circle cx="0" cy="-86" r="9" fill="url(#gem)"/>
      <path d="M -18 -38 C -10 -32 10 -32 18 -38" fill="none" stroke="#e7fffa" stroke-width="2" opacity=".8"/>
    </g>
    <g transform="translate(334 808)">
      <path d="M -26 -26 C -18 -38 8 -40 20 -30 C 28 -22 28 -6 20 4 C 10 16 -14 16 -24 4 C -30 -4 -30 -18 -26 -26 Z" fill="url(#skin)" stroke="${c.skin[2]}" stroke-width="1.6"/>
      <path d="M -18 -20 C -8 -30 8 -30 18 -22 M -20 -6 C -10 2 8 2 18 -6" fill="none" stroke="${c.skin[2]}" stroke-width="2" opacity=".65"/>
      <path d="M -23 -18 C -34 -14 -38 -4 -32 4" fill="none" stroke="${c.skin[2]}" stroke-width="6" stroke-linecap="round"/>
    </g>
    <path d="M 306 924 C 320 942 344 940 356 920" fill="none" stroke="url(#gold)" stroke-width="5" stroke-linecap="round"/>
    <path d="M 312 950 C 326 966 342 962 352 944" fill="none" stroke="url(#gold)" stroke-width="4" stroke-linecap="round"/>
  </g>`
  return portraitBg(c) + `<g transform="translate(550 390)">${hairBack(c)}</g>` + body + `<g transform="translate(550 390)">${headFront(c)}</g>` + foreground
}

const ysolde = (c) => {
  const body = `
  <path d="M 300 660 C 250 760 236 980 260 1250 L 400 1250 C 380 1000 390 800 430 690 Z" fill="#0a2530" opacity=".94"/>
  <path d="M 800 660 C 850 760 864 980 840 1250 L 700 1250 C 720 1000 710 800 670 690 Z" fill="#0a2530" opacity=".94"/>
  <path d="M 316 662 C 286 790 286 1030 314 1250 M 784 662 C 814 790 814 1030 786 1250" fill="none" stroke="${c.accent}" stroke-width="2" opacity=".35"/>
  ${neckAndChest}
  <path d="M 322 720 C 368 670 454 654 505 698 C 522 712 536 714 550 704 C 564 714 578 712 595 698 C 646 654 732 670 778 720 L 798 1250 L 302 1250 Z" fill="url(#cloth)"/>
  <path d="M 322 720 C 368 670 454 654 505 698 C 522 712 536 714 550 704 C 564 714 578 712 595 698 C 646 654 732 670 778 720 L 782 780 C 690 728 610 708 550 708 C 490 708 410 728 318 780 Z" fill="#345263" opacity=".5"/>
  <path d="M 324 722 C 370 674 454 658 505 700 C 522 714 536 716 550 706 C 564 716 578 714 595 700 C 646 658 730 674 776 722" fill="none" stroke="url(#gold)" stroke-width="5"/>
  <path d="M 360 742 L 424 1110 L 676 1110 L 740 742 M 550 744 L 550 1110" fill="none" stroke="url(#gold)" stroke-width="2" opacity=".5"/>
  <path d="M 392 780 C 470 822 630 822 708 780 M 400 900 C 478 942 622 942 700 900" fill="none" stroke="#6f8c9a" stroke-width="3" opacity=".3"/>
  <path d="M 448 820 C 448 900 452 1000 458 1090 M 550 816 L 550 1090 M 652 820 C 652 900 648 1000 642 1090" stroke="${c.accent}" stroke-width="1.8" opacity=".5"/>
  <g fill="url(#gold)">
    <path d="M 550 780 L 562 802 L 550 824 L 538 802 Z"/>
    <circle cx="550" cy="802" r="4" fill="${c.gem}"/>
  </g>
  <g>
    <path d="M 494 570 C 512 594 588 594 606 570 L 610 628 C 584 650 516 650 490 628 Z" fill="#0b1720"/>
    <path d="M 490 628 C 516 650 584 650 610 628" fill="none" stroke="url(#gold)" stroke-width="3"/>
    <g fill="url(#gold)"><circle cx="550" cy="644" r="9"/><circle cx="550" cy="644" r="4" fill="${c.gem}"/></g>
    <path d="M 504 662 L 504 720 C 528 736 572 736 596 720 L 596 662" fill="none" stroke="#1e3746" stroke-width="18"/>
  </g>
  <g>
    <path d="M 338 668 C 292 696 274 776 284 858 C 292 918 308 978 320 1030 L 376 1018 C 360 938 352 858 362 792 C 370 742 386 700 404 680 Z" fill="url(#skin)"/>
    <path d="M 330 658 C 376 644 412 662 426 696 C 414 726 388 740 356 734 C 330 728 314 704 318 682 Z" fill="#162631" stroke="url(#gold)" stroke-width="2.4"/>
    <path d="M 336 674 C 360 664 386 670 402 686" fill="none" stroke="#71919e" stroke-width="2" opacity=".5"/>
    <path d="M 296 860 C 314 850 326 826 334 804" fill="none" stroke="${c.skin[2]}" stroke-width="2" opacity=".4"/>
    <path d="M 762 668 C 808 696 826 776 816 858 C 808 918 792 978 780 1030 L 724 1018 C 740 938 748 858 738 792 C 730 742 714 700 696 680 Z" fill="url(#skin)"/>
    <path d="M 770 658 C 724 644 688 662 674 696 C 686 726 712 740 744 734 C 770 728 786 704 782 682 Z" fill="#162631" stroke="url(#gold)" stroke-width="2.4"/>
    <path d="M 764 674 C 740 664 714 670 698 686" fill="none" stroke="#71919e" stroke-width="2" opacity=".5"/>
    <g fill="none" stroke="url(#gold)" stroke-width="5" stroke-linecap="round">
      <path d="M 332 706 C 318 760 318 820 330 872"/>
      <path d="M 768 706 C 782 760 782 820 770 872"/>
    </g>
    <g fill="url(#gold)" opacity=".9">
      <circle cx="330" cy="730" r="5"/><circle cx="330" cy="790" r="5"/><circle cx="770" cy="730" r="5"/><circle cx="770" cy="790" r="5"/>
    </g>
  </g>`
  const foreground = `<g>
    <g transform="translate(778 868) rotate(22)">
      <rect x="-5" y="-300" width="10" height="330" rx="4" fill="#9aa9b4"/>
      <rect x="-1.5" y="-300" width="3" height="330" fill="#e7f3f6" opacity=".7"/>
      <path d="M -54 40 C -40 -10 -20 -26 0 -26 C 20 -26 40 -10 54 40 L 40 48 C 28 12 16 0 0 0 C -16 0 -28 12 -40 48 Z" fill="url(#gold)"/>
      <path d="M -54 40 L 54 40" stroke="#5b431c" stroke-width="4"/>
      <path d="M -10 -70 C -10 -120 10 -120 10 -70 L 10 40 L -10 40 Z" fill="#203644" stroke="url(#gold)" stroke-width="3"/>
      <circle cx="0" cy="16" r="7" fill="${c.gem}"/>
    </g>
    <path d="M 760 826 C 748 806 750 778 768 760 C 788 742 814 750 824 770 C 834 792 826 818 808 834 C 794 846 774 842 760 826 Z" fill="#1a2d39" stroke="url(#gold)" stroke-width="2"/>
    <path d="M 770 792 C 782 786 796 788 806 796 M 766 808 C 780 802 796 804 808 812" fill="none" stroke="#7896a3" stroke-width="2" opacity=".7"/>
    <path d="M 748 792 C 758 772 780 762 802 766" fill="none" stroke="#2c4a58" stroke-width="12" stroke-linecap="round"/>
    <path d="M 806 830 C 816 844 830 842 836 828" fill="none" stroke="url(#gold)" stroke-width="3"/>
  </g>`
  return portraitBg(c) + `<g transform="translate(550 390)">${hairBack(c)}</g>` + body + `<g transform="translate(550 390)">${headFront(c)}</g>` + foreground
}

const SVGS = {
  seraphine: c => svgDefs(c) + seraphine(c),
  mirelle: c => svgDefs(c) + mirelle(c),
  ysolde: c => svgDefs(c) + ysolde(c),
}

for (const key of Object.keys(CHARS)) {
  await render(`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1250" viewBox="0 0 1000 1250">${SVGS[key](CHARS[key])}</svg>`, `${key}_portrait.png`, 1000, 1250)
}
